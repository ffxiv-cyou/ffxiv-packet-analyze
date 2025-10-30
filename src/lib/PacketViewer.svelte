<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { Packet } from "overlay-toolkit-lib";

  let {
    packets,
  }: {
    packets: Packet[];
  } = $props();

  let opcodeFilter: string = $state("");
  // let filteredPackets = $derived(opcodeFilter ?
  //   packets.filter(
  //     (packet) => packet.opcode === parseInt(opcodeFilter),
  //   ) : packets,
  // );
  let filteredPackets = $derived(packets);

  let packetIdx: number = $state(-1);
  let packet: Packet | null = $derived(
    packetIdx > -1 && filteredPackets.length > packetIdx
      ? filteredPackets[packetIdx]
      : null,
  );

  let dw = $derived.by(() => {
    if (!packet) return new DataView(new ArrayBuffer(0));
    return new DataView(packet.data.buffer);
  });

  function setPacket(index: number) {
    packetIdx = index;
  }

  const ITEM_HEIGHT = 32;
  const OVERSCAN = 5; // Virtualization padding to avoid pop-in while scrolling
  let listContainer: HTMLDivElement | null = null;
  let scrollTop: number = $state(0);
  let containerHeight: number = $state(0);

  type VisiblePacket = { packet: Packet; index: number };

  type VisibleMetrics = { start: number; end: number; capacity: number };

  let visibleMetrics: VisibleMetrics = $derived.by(() => {
    const size = filteredPackets.length;
    const capacity = Math.max(1, Math.ceil(containerHeight / ITEM_HEIGHT));
    const rawStart = Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN;
    const maxStart = Math.max(0, size - capacity);
    const start = Math.max(0, Math.min(rawStart, maxStart));
    const end = Math.min(size, start + capacity + OVERSCAN * 2);
    return { start, end, capacity };
  });

  let startIndex = $derived(visibleMetrics.start);
  let endIndex = $derived(visibleMetrics.end);
  let visiblePackets: VisiblePacket[] = $derived(
    filteredPackets.slice(startIndex, endIndex).map((packet, offset) => ({
      packet,
      index: startIndex + offset,
    })),
  );

  let topPadding = $derived(startIndex * ITEM_HEIGHT);
  let bottomPadding = $derived(
    Math.max(
      0,
      filteredPackets.length * ITEM_HEIGHT -
        (topPadding + visiblePackets.length * ITEM_HEIGHT),
    ),
  );

  $effect(() => {
    const maxScroll = Math.max(
      0,
      filteredPackets.length * ITEM_HEIGHT - containerHeight,
    );
    if (scrollTop > maxScroll) {
      scrollTop = maxScroll;
      if (listContainer && listContainer.scrollTop > maxScroll) {
        listContainer.scrollTop = maxScroll;
      }
    }
  });

  function toHexString(data: Uint8Array): string {
    return Array.from(data)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join(" ");
  }

  function formatEpoch(epoch: number): string {
    const date = new Date(epoch);
    return date.toLocaleTimeString();
  }

  function padHex(num: number, length: number): string {
    return num.toString(16).padStart(length, "0");
  }

  let selectedIndex: number = $state(-1);
  function inspectAt(byteIndex: number) {
    selectedIndex = byteIndex;
  }

  function getString(dw: DataView, offset: number): string {
    const decoder = new TextDecoder();
    let term = offset;
    for (; term < dw.byteLength; term++) {
      if (dw.getUint8(term) === 0) break;
    }

    const bytes = new Uint8Array(dw.buffer, offset, term - offset);
    return decoder.decode(bytes);
  }

  function scrollToPacket(index: number) {
    if (!listContainer) return;
    const viewTop = listContainer.scrollTop;
    const viewBottom = viewTop + containerHeight;
    const top = index * ITEM_HEIGHT;
    const bottom = top + ITEM_HEIGHT;

    if (top < viewTop) {
      listContainer.scrollTo({ top });
      scrollTop = top;
    } else if (bottom > viewBottom) {
      const nextTop = bottom - containerHeight;
      listContainer.scrollTo({ top: nextTop });
      scrollTop = listContainer.scrollTop;
    }
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

  function handleScroll(event: Event) {
    const target = event.currentTarget as HTMLElement;
    scrollTop = target.scrollTop;
  }

  let resizeObserver: ResizeObserver | null = null;

  onMount(() => {
    if (!listContainer) return;
    containerHeight = listContainer.clientHeight;
    scrollTop = listContainer.scrollTop;
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === listContainer) {
          containerHeight = entry.contentRect.height;
        }
      }
    });
    resizeObserver.observe(listContainer);
  });

  onDestroy(() => {
    resizeObserver?.disconnect();
  });
</script>

<div class="viewer-filter">
  <div>
    Count: {filteredPackets.length}
  </div>
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
    onscroll={handleScroll}
    bind:this={listContainer}
  >
    <div style={`height: ${topPadding}px;`}></div>
    {#each visiblePackets as item}
      <button
        id={"packet-" + item.index}
        class={["packet-item", packetIdx === item.index ? "selected" : ""]}
        onclick={() => setPacket(item.index)}
      >
        <span class="packet-dir">{item.packet.dir ? "C" : "S"}</span>
        <span class="packet-time">{formatEpoch(item.packet.epoch)}</span>
        <span class="packet-len"
          >{padHex(item.packet.data.length, 3)}h</span
        >
        <span class="packet-opcode">{padHex(item.packet.opcode, 4)}</span>
        <span class="packet-data">{toHexString(item.packet.data)}</span>
      </button>
    {/each}
    <div style={`height: ${bottomPadding}px;`}></div>
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
      <div class="packet-inspect">
        {#if selectedIndex >= 0 && selectedIndex < dw.byteLength}
          <ul>
            <li>
              <span class="inspect-name">Offset</span>
              {selectedIndex} ({padHex(selectedIndex, 2)}h)
            </li>
            <li>
              <span class="inspect-name">uint8</span>
              {dw.getUint8(selectedIndex)}
            </li>
            <li>
              <span class="inspect-name">int8</span>
              {dw.getInt8(selectedIndex)}
            </li>
            {#if selectedIndex + 1 < dw.byteLength}
              <li>
                <span class="inspect-name">uint16</span>
                {dw.getUint16(selectedIndex, true)}
              </li>
              <li>
                <span class="inspect-name">int16</span>
                {dw.getInt16(selectedIndex, true)}
              </li>
            {/if}
            {#if selectedIndex + 3 < dw.byteLength}
              <li>
                <span class="inspect-name">uint32</span>
                {dw.getUint32(selectedIndex, true)}
              </li>
              <li>
                <span class="inspect-name">int32</span>
                {dw.getInt32(selectedIndex, true)}
              </li>
            {/if}
            {#if selectedIndex + 7 < dw.byteLength}
              <li>
                <span class="inspect-name">uint64</span>
                {dw.getBigUint64(selectedIndex, true)}
              </li>
              <li>
                <span class="inspect-name">int64</span>
                {dw.getBigInt64(selectedIndex, true)}
              </li>
            {/if}
            {#if selectedIndex + 3 < dw.byteLength}
              <li>
                <span class="inspect-name">float32</span>
                {dw.getFloat32(selectedIndex, true)}
              </li>
            {/if}
            {#if selectedIndex + 7 < dw.byteLength}
              <li>
                <span class="inspect-name">float64</span>
                {dw.getFloat64(selectedIndex, true)}
              </li>
            {/if}
            <li>
              <span class="inspect-name">string</span>
              {getString(dw, selectedIndex)}
            </li>
          </ul>
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

    & .inspect-name {
      display: inline-block;
      font-weight: 500;
      width: 60px;
      margin-right: 10px;
      &::after {
        content: ":";
      }
    }
  }

  .packet-list {
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 5px;
    background-color: #f9f9f9;
    font-size: 12px;
    width: 1000px;
    margin-top: 32px;
  }

  .packet-item {
    padding: 5px;
    border-bottom: 1px solid #eee;
    display: flex;
    font-family: "Fira Code", monospace;
    gap: 10px;
    min-height: 32px;
    align-items: center;
    box-sizing: border-box;

    &.selected {
      background-color: #c0c0ff;
    }
  }

  button.packet-item {
    width: 100%;
    text-align: left;
    background: none;
    cursor: pointer;
    border-radius: 0;
  }
  button.packet-item:hover {
    background-color: #e0e0e0;
    border: inherit;
    &.selected {
      background-color: #a0a0ff;
    }
  }

  .packet-data {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
