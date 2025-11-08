<script lang="ts">
  import { padHex, bytesToString } from "../model/data_utils";

  let {
    dw,
    selectedIndex,
  }: {
    dw: DataView;
    selectedIndex: number;
  } = $props();

  function formatTime(epoch: number): string {
    const date = new Date(epoch);
    return date.toISOString();
  }
</script>

<div class="packet-inspect">
  {#if selectedIndex >= 0 && selectedIndex < dw.byteLength}
    <ul>
      <li>
        <span class="inspect-name">Offset</span>
        {selectedIndex} ({padHex(selectedIndex, 2)}h, {selectedIndex - 32} without header)
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
      {#if selectedIndex + 3 < dw.byteLength}
        <li>
          <span class="inspect-name">time</span>
          {formatTime(dw.getUint32(selectedIndex, true) * 1000)}
        </li>
      {/if}
      <li>
        <span class="inspect-name">string</span>
        {bytesToString(dw, selectedIndex)}
      </li>
    </ul>
  {/if}
</div>

<style>
  .packet-inspect {
    padding: 10px;
    font-family: monospace;

    & ul {
      list-style: none;
      padding: 0;
      margin: 0;

      & li {
        margin-bottom: 4px;
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
</style>
