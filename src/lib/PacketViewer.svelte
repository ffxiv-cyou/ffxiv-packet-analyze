<script lang="ts">
  import type { Packet } from "overlay-toolkit-lib";
  import SvelteVirtualList from "@humanspeak/svelte-virtual-list";
  import opcodes from "../data/opcode.json";
  import type { OpcodeList } from "../model/opcode";
  import ByteInspector from "./ByteInspector.svelte";
  import { bytesToHex, epochToTimeString, padHex } from "../model/data_utils";

  let {
    packets,
  }: {
    packets: Packet[];
  } = $props();

  let opcodeFilter: string = $state("");
  let filteredPackets = $state<Array<Packet>>([]);
  let lastFilterNumber = -1;
  let lastFilter = "";

  function filterList(filter: string) {
    if (lastFilterNumber >= packets.length || filter !== lastFilter) {
      filteredPackets = [];
      lastFilterNumber = -1;
    }
    lastFilter = filter;
    const filterCode = parseInt(filter);
    if (isNaN(filterCode) || filter === "") {
      for (let i = lastFilterNumber + 1; i < packets.length; i++) {
        filteredPackets.push(packets[i]);
      }
      lastFilterNumber = packets.length - 1;
      return;
    }

    for (let i = lastFilterNumber + 1; i < packets.length; i++) {
      const packet = packets[i];
      if (packet.opcode === filterCode) {
        filteredPackets.push(packets[i]);
      }
      lastFilterNumber = i;
    }
  }

  $effect(() => {
    packets;
    filterList(opcodeFilter);
  });

  let packetIdx: number = $state(-1);
  let packet: Packet | null = $derived(
    packetIdx > -1 && filteredPackets.length > packetIdx
      ? filteredPackets[packetIdx]
      : null,
  );

  let dw = $derived.by(() => {
    if (!packet) return new DataView(new ArrayBuffer(0));
    return new DataView(
      packet.data.buffer,
      packet.data.byteOffset,
      packet.data.byteLength,
    );
  });

  function setPacket(index: number) {
    packetIdx = index;
  }

  let selectedIndex: number = $state(-1);
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
    if (event.key === "ArrowUp") {
      if (packetIdx > 0) {
        packetIdx -= 1;
        if (selectedIndex >= dw.byteLength) selectedIndex = -1;
        scrollToPacket(packetIdx);
      }
      event.preventDefault();
    } else if (event.key === "ArrowDown") {
      if (packetIdx + 1 < filteredPackets.length) {
        packetIdx += 1;
        if (selectedIndex >= dw.byteLength) selectedIndex = -1;
        scrollToPacket(packetIdx);
      }
      event.preventDefault();
    }
  }

  function getOpcodeName(opcode: number, dir: boolean): string | null {
    const list = opcodes as OpcodeList[];

    for (const entry of list) {
      if (entry.region !== "CN") continue;

      const l = dir
        ? entry.lists.ClientZoneIpcType
        : entry.lists.ServerZoneIpcType;
      const name = l.find((item) => item.opcode === opcode)?.name;
      if (name) return name;
    }

    return null;
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
</div>

<div class="packet-viewer">
  <div
    class="packet-list"
    role="listbox"
    tabindex="0"
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
      <div class="packet-hex">
        {#each packet.data as byte, i}
          <button
            type="button"
            class={["hex-item", selectedIndex === i ? "selected" : ""]}
            onclick={() => inspectAt(i)}
            aria-label={"Inspect byte at index " + i}
            >{byte.toString(16).padStart(2, "0")}</button
          >
        {/each}
      </div>
      <ByteInspector {dw} {selectedIndex} />
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

    & .packet-hex {
      background-color: #f0f0f0;
      padding: 10px;
      border: 1px solid #ccc;
      font-family: "Fira Code", monospace;
      font-size: 12px;
      overflow-x: auto;
      line-break: anywhere;
      width: 30em;
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
