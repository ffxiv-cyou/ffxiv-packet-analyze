<script lang="ts">
  import type { Packet } from "overlay-toolkit-lib";
  import { OpcodeRepo, padHex, subTypeKey } from "../model/data_utils";

  import type { IPCData } from "../model/ipc_struct";
  import ipcStructs from "../data/ipc_structs.json";
  import FieldViewer from "./FieldViewer.svelte";
  import ipcAlias from "../data/opcode_alias.json";

  let {
    packet,
    repo,
  }: {
    packet: Packet;
    repo: OpcodeRepo;
  } = $props();

  let ipcNameAlias: Record<string, string> = ipcAlias as Record<string, string>;
  let ipcTypeName = $derived(repo.getOpcodeName(packet.opcode, packet.dir));
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

  let subTypeField = $derived(subTypeKey(ipcStruct?.name || ""));
  let subTypeValue = $derived.by(() => {
    const field = ipcStruct?.fields.find((f) => f.name === subTypeField);
    if (field) {
      switch (field.type) {
        case "uint8":
          return dw.getUint8(field.offset);
        case "int8":
          return dw.getInt8(field.offset);
        case "uint16":
          return dw.getUint16(field.offset, true);
        case "int16":
          return dw.getInt16(field.offset, true);
        case "uint32":
          return dw.getUint32(field.offset, true);
        case "int32":
          return dw.getInt32(field.offset, true);
      }
    }
    return undefined;
  });
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
          <FieldViewer
            {dw}
            offset={field.offset}
            {field}
            type={ipcStruct.name}
            subType={subTypeField}
            subValue={subTypeValue}
          />
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
</style>
