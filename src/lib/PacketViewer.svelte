<script lang="ts">
  import type { Packet } from "overlay-toolkit-lib";
  import SvelteVirtualList from "@humanspeak/svelte-virtual-list";
  import ByteInspector from "./ByteInspector.svelte";
  import {
    bytesToHex,
    epochToTimeString,
    padHex,
    getOpcodeName,
  } from "../model/data_utils";
  import PacketFields from "./PacketFields.svelte";

  let {
    packets,
  }: {
    packets: Packet[];
  } = $props();

  let filteredPackets = $derived(packets);
  let opcodeFilter: string = $state("");

  function findNext() {
    for (let i = packetIdx + 1; i < filteredPackets.length; i++) {
      const element = filteredPackets[i];
      if (element.opcode === parseInt(opcodeFilter)) {
        setPacket(i);
        scrollToPacket(i);
        return;
      }
    }
  }
  
  function findPrev() {
    for (let i = packetIdx - 1; i >= 0; i--) {
      const element = filteredPackets[i];
      if (element.opcode === parseInt(opcodeFilter)) {
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
</script>

<div class="viewer-filter">
  <span>
    Count: {filteredPackets.length}
  </span>
  <label>
    Opcode:
    <input type="text" bind:value={opcodeFilter} placeholder="enter opcode" />
  </label>
  <button type="button" onclick={findNext}>next</button>
  <button type="button" onclick={findPrev}>prev</button>
</div>

<div class="packet-viewer">
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
          <span class="packet-data">{bytesToHex(item.data.slice(32, 64))}</span>
          {#if getOpcodeName(item.opcode, item.dir)}
            <span class="packet-name">
              {getOpcodeName(item.opcode, item.dir)}
            </span>
          {/if}
        </button>
      {/snippet}
    </SvelteVirtualList>
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
      <div class="packet-info"></div>
      {#if selectedIndex < 0}
        <PacketFields {packet} />
      {:else}
        <ByteInspector {dw} {selectedIndex} />
      {/if}
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
      font-size: 12px;
    }

    & .packet-hex {
      background-color: #f0f0f0;
      padding: 10px;
      border: 1px solid #ccc;
      font-family: "Fira Code", monospace;
      font-size: 12px;
      overflow-x: auto;
      line-break: anywhere;
      width: 31em;
      height: 20em;

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

  .packet-list {
    overflow-y: auto;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    font-size: 12px;
    width: 1000px;
    margin-top: 32px;

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
