<script lang="ts">
  import type { Packet } from "overlay-toolkit-lib";
  import SvelteVirtualList from "@humanspeak/svelte-virtual-list";
  import ByteInspector from "./ByteInspector.svelte";
  import {
    bytesToHex,
    epochToTimeString,
    padHex,
    OpcodeRepo,
  } from "../model/data_utils";
  import PacketFields from "./PacketFields.svelte";
  import { onMount } from "svelte";

  let {
    packets,
  }: {
    packets: Packet[];
  } = $props();

  let filteredPackets: Packet[] = $state.raw([]);
  let opcodeFilter: string = $state("");

  const repo = new OpcodeRepo("CN");

  function filterToOpcode(filter: string): number | undefined {
    let opcode = parseInt(filter);
    if (opcode) return opcode;

    let opcodeByName = repo.getNameOpcode(filter);
    if (opcodeByName) return opcodeByName;

    return undefined;
  }

  function findNext() {
    const opcode = filterToOpcode(opcodeFilter);
    if (opcode === undefined) return;

    for (let i = packetIdx + 1; i < filteredPackets.length; i++) {
      const element = filteredPackets[i];
      if (element.opcode === opcode) {
        setPacket(i);
        scrollToPacket(i);
        return;
      }
    }
  }

  function findPrev() {
    const opcode = filterToOpcode(opcodeFilter);
    if (opcode === undefined) return;

    for (let i = packetIdx - 1; i >= 0; i--) {
      const element = filteredPackets[i];
      if (element.opcode === opcode) {
        setPacket(i);
        scrollToPacket(i);
        return;
      }
    }
  }

  let packetIdx: number = $state(-1);
  let packet: Packet | null = $derived(
    packetIdx > -1 && filteredPackets.length > packetIdx
      ? filteredPackets[packetIdx]
      : null,
  );

  function setPacket(index: number) {
    packetIdx = index;
  }

  let dw = $derived.by(() => {
    if (!packet) return new DataView(new ArrayBuffer(0));
    return new DataView(
      packet.data.buffer,
      packet.data.byteOffset,
      packet.data.byteLength,
    );
  });

  let selectedIndex: number = $state(-1);
  $effect(() => {
    if (selectedIndex >= dw.byteLength) selectedIndex = -1;
  });
  function inspectAt(byteIndex: number) {
    selectedIndex = byteIndex;
  }

  let listRef: SvelteVirtualList<Packet> | null = null;
  function scrollToPacket(index: number) {
    listRef?.scroll({
      index,
      smoothScroll: false,
      align: "nearest",
    });
  }

  function handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowUp":
        if (packetIdx > 0) {
          packetIdx -= 1;
        }
        break;
      case "ArrowDown":
        if (packetIdx + 1 < filteredPackets.length) {
          packetIdx += 1;
        }
        break;
      default:
        return;
    }

    const target = event.target as HTMLElement;

    event.preventDefault();
    scrollToPacket(packetIdx);
    target?.parentElement?.focus();
  }

  function handleSearchKey(event: KeyboardEvent) {
    if (event.key === "Enter") {
      findNext();
      event.preventDefault();
    }
  }

  function handleInspectKey(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowLeft":
        if (selectedIndex > 0) {
          selectedIndex -= 1;
        }
        break;
      case "ArrowRight":
        if (selectedIndex + 1 < dw.byteLength) {
          selectedIndex += 1;
        }
        break;
      case "ArrowUp":
        if (selectedIndex - 16 >= 0) {
          selectedIndex -= 16;
        }
        break;
      case "ArrowDown":
        if (selectedIndex + 16 < dw.byteLength) {
          selectedIndex += 16;
        }
        break;
      case "Escape":
        selectedIndex = -1;
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  function sync() {
    if (filteredPackets.length != packets.length) filteredPackets = packets;
  }

  let intervalHandler: number | null = null;

  onMount(() => {
    if (!intervalHandler) intervalHandler = setInterval(sync, 100);
  });
</script>

<div class="packet-viewer">
  <div class="packet-left">
    <div class="viewer-filter">
      <span class="label"> Count: </span>
      <span class="value">
        {filteredPackets.length}
      </span>
      <label>
        <span class="label"> Opcode: </span>
        <input
          type="text"
          bind:value={opcodeFilter}
          onkeypress={handleSearchKey}
          placeholder="enter opcode"
        />
      </label>
      <button type="button" onclick={findPrev}>↑</button>
      <button type="button" onclick={findNext}>↓</button>
    </div>
    <div
      class="packet-list"
      role="listbox"
      tabindex="-1"
      onkeydown={handleKeyDown}
    >
      <SvelteVirtualList items={filteredPackets} bind:this={listRef}>
        {#snippet renderItem(item, index)}
          <button
            id={"packet-" + index}
            class={["packet-item", packetIdx === index ? "selected" : ""]}
            onclick={() => setPacket(index)}
          >
            <span class="packet-dir">{item.dir ? "C" : "S"}</span>
            <span class="packet-time">{epochToTimeString(item.epoch)}</span>
            <span class="packet-len">{padHex(item.data.length, 3)}h</span>
            <span class="packet-opcode">{padHex(item.opcode, 4)}</span>
            <span class="packet-data"
              >{bytesToHex(item.data.slice(32, 64))}</span
            >
            {#if repo.getOpcodeName(item.opcode, item.dir)}
              <span class="packet-name">
                {repo.getOpcodeName(item.opcode, item.dir)}
              </span>
            {/if}
          </button>
        {/snippet}
      </SvelteVirtualList>
    </div>
  </div>

  <div class="packet-detail">
    {#if packet}
      <div class="packet-header">
        <span class="packet-dir">{packet.dir ? "Client" : "Server"}</span>
        <span class="packet-time"
          >{new Date(packet.epoch).toLocaleTimeString()}</span
        >
        Length: <span class="packet-len">{padHex(packet.data.length, 3)}h</span>
        Opcode: <span class="packet-opcode">{padHex(packet.opcode, 4)}</span>
      </div>
      <div
        class="packet-hex"
        onkeydown={handleInspectKey}
        role="grid"
        tabindex="-1"
      >
        {#each packet.data as byte, i}
          <button
            type="button"
            class={["hex-item", selectedIndex === i ? "selected" : ""]}
            onclick={() => inspectAt(i)}
            aria-label={"Inspect byte at " + i}
            >{byte.toString(16).padStart(2, "0")}</button
          >
        {/each}
      </div>
      <div class="packet-info">
        {#if selectedIndex < 0}
          <PacketFields {packet} {repo} />
        {:else}
          <ByteInspector {dw} {selectedIndex} />
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .packet-viewer {
    display: flex;
    gap: 10px;
    height: 600px;
  }

  .packet-detail {
    text-align: left;
    width: 382px;

    & .packet-header {
      height: 32px;
    }

    & .packet-info {
      max-height: 26em;
      overflow: auto;
    }

    & .packet-info,
    & .packet-hex {
      font-size: 12px;
      padding: 10px;
      overflow-x: auto;
      width: 31em;
      border: 1px solid #ccc;
      font-family: "Fira Code", monospace;
    }

    & .packet-hex {
      background-color: #f0f0f0;
      line-break: anywhere;
      height: 12lh;

      & .hex-item {
        button& {
          background: inherit;
          border: none;
          cursor: pointer;
          border-radius: inherit;
          font-weight: inherit;
          font-size: inherit;
        }

        display: inline-block;
        width: 22px;
        line-height: 18px;
        text-align: center;
        user-select: none;
        padding: 1px;

        &:nth-child(-n + 8):nth-child(n + 5) {
          background-color: #80ddff;
        }
        &:nth-child(-n + 12):nth-child(n + 9) {
          background-color: #80bbff;
        }
        &:nth-child(-n + 32) {
          background-color: #c0c0c0;
        }

        &.selected {
          background-color: #0066cc;
          color: white;
        }
      }
    }
  }

  .packet-left {
    width: 1000px;
    display: flex;
    flex-direction: column;
  }

  .viewer-filter {
    height: 32px;
    text-align: left;

    & button {
      padding: 2px 8px;
    }

    .label {
      margin-left: 10px;
      font-weight: 600;
    }
  }

  .packet-list {
    overflow-y: auto;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    font-size: 12px;
    flex: 1;

    & .packet-item {
      padding: 5px 10px;
      border-bottom: 1px solid #eee !important;
      display: flex;
      font-family: "Fira Code", monospace;
      gap: 10px;
      min-height: 32px;
      align-items: center;
      box-sizing: border-box;
      width: 100%;
      text-align: left;

      &:hover {
        background-color: #e0e0e0;
      }
      &.selected {
        background-color: #c0c0ff;
        &:hover {
          background-color: #a0a0ff;
        }
      }
    }

    & button {
      background: none;
      cursor: pointer;
      border-radius: 0;
      transition: none;
      border: none;
    }

    & .packet-name {
      color: #800080;
      padding: 0 3px;
    }

    .packet-data {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      flex-grow: 1;
    }
  }
  .packet-dir {
    font-weight: bold;
  }
  .packet-time {
    color: #888;
  }
  .packet-opcode {
    font-weight: bold;
    color: #0066cc;
  }
  .packet-len {
    color: #009900;
  }
</style>
