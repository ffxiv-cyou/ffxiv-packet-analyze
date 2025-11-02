<script lang="ts">
  import type { Packet } from "overlay-toolkit-lib";
  import { getOpcodeName, padHex } from "../model/data_utils";

  import type { IPCData } from "../model/ipc_struct";
  import ipcStructs from "../data/ipc_structs.json";
  import FieldViewer from "./FieldViewer.svelte";
  import ipcAlias from "../data/opcode_alias.json";

  let {
    packet,
  }: {
    packet: Packet;
  } = $props();

  let ipcNameAlias: Record<string, string> = ipcAlias as Record<string, string>;
  let ipcTypeName = $derived(getOpcodeName(packet.opcode, packet.dir));
  let ipcTypeAlias = $derived(
    ipcTypeName ? ipcNameAlias[ipcTypeName] || ipcTypeName : null,
  );

  let dw = $derived(
    new DataView(
      packet.data.buffer,
      packet.data.byteOffset + 32,
      packet.data.byteLength - 32,
    ),
  );

  let structs: IPCData = ipcStructs as IPCData;
  let ipcStruct = $derived(
    structs.structs.find(
      (s) => s.ipcName === ipcTypeAlias || s.name === "FFXIVIpc" + ipcTypeAlias,
    ) || null,
  );
  let valid = $derived(ipcStruct && dw.byteLength >= ipcStruct.size);
</script>

<div class="packet-fields">
  <div>
    {#if ipcTypeName}
      IPC Type: {ipcTypeName}
      {#if ipcStruct && dw.byteLength != ipcStruct?.size}
        <span>(size {dw.byteLength} != {ipcStruct?.size})</span>
      {/if}
    {:else}
      <span>Unknown IPC Type: 0x{padHex(packet.opcode, 4)}</span>
    {/if}
  </div>
  <div>
    {#if ipcStruct}
      {#if valid}
        {#each ipcStruct.fields as field}
          <FieldViewer {dw} offset={field.offset} {field} type={ipcStruct.name} />
        {/each}
      {:else}
        <span
          >Data length ({dw.byteLength} bytes) is less than expected structure size
          ({ipcStruct.size} bytes).</span
        >
      {/if}
    {:else}
      <span>No structure information available for this IPC type.</span>
    {/if}
  </div>
</div>

<style>
  .packet-fields {
    font-family: monospace;
    font-size: 14px;
    padding: 8px;
    border-bottom: 1px solid #ccc;
  }
</style>
