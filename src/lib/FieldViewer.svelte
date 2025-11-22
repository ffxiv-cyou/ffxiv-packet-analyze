<script lang="ts">
  import {
    bytesToHex,
    bytesToString,
    fieldHasAlias,
    getFieldAlias,
  } from "../model/data_utils";
  import type { IPCStructField, IPCTypeAlias } from "../model/ipc_struct";
  import ipcStructs from "../data/ipc_structs.json";
  import Self from "./FieldViewer.svelte";

  let {
    dw,
    offset,
    field,
    type,
    subType,
    subValue,
  }: {
    dw: DataView;
    offset: number;
    field: IPCStructField;
    type: string;
    subType?: string;
    subValue?: number;
  } = $props();

  function getNumberValue(i: number): number | bigint | undefined {
    switch (field.type) {
      case "uint8":
        return dw.getUint8(offset + i);
      case "int8":
        return dw.getInt8(offset + i);
      case "uint16":
        return dw.getUint16(offset + i * 2, true);
      case "int16":
        return dw.getInt16(offset + i * 2, true);
      case "uint32":
        return dw.getUint32(offset + i * 4, true);
      case "int32":
        return dw.getInt32(offset + i * 4, true);
      case "uint64":
        return dw.getBigUint64(offset + i * 4, true);
      case "int64":
        return dw.getBigInt64(offset + i * 4, true);
      case "float":
        return dw.getFloat32(offset + i * 4, true);
      case "double":
        return dw.getFloat64(offset + i * 8, true);
    }
    return undefined;
  }

  function getEnumRawValue(i: number): number | undefined {
    switch (field.size) {
      case 1:
        return dw.getUint8(offset + i);
      case 2:
        return dw.getUint16(offset + i * 2, true);
      case 4:
        return dw.getUint32(offset + i * 4, true);
    }
    return undefined;
  }

  const enums = ipcStructs.enums as IPCTypeAlias[];

  function getEnumValue(i: number): string | undefined {
    const enumDef = enums.find((e) => e.name === field.type);
    if (!enumDef) {
      return undefined;
    }
    const rawValue = getEnumRawValue(i);
    const enumName = enumDef.enum[rawValue as number];
    if (enumName !== undefined) {
      return enumName + ` (${rawValue})`;
    }
    return rawValue?.toString();
  }
</script>

<div class="field-item">
  <div class="field-name">{field.name}:</div>
  {#if (field.type === "int8" || field.type === "uint8") && (field.arrayLength || 0) > 1}
    {#if field.name.match(/name$/i)}
      <span>{bytesToString(dw, offset, field.arrayLength)}</span>
    {:else}
      <span
        >{bytesToHex(
          new Uint8Array(dw.buffer, dw.byteOffset + offset, field.arrayLength),
        )}</span
      >
    {/if}
  {:else}
    <div class="field-values">
      {#each { length: field.arrayLength || 1 } as _, i}
        <div class="field-value">
          {#if field.fields}
            {#each field.fields as subField}
              <Self
                {dw}
                offset={offset + (subField.offset || 0) + i * (field.size || 1)}
                field={subField}
                type={field.type}
              />
            {/each}
          {:else if getEnumValue(i) !== undefined}
            <span>{getEnumValue(i)}</span>
          {:else if getNumberValue(i) !== undefined}
            <span>{getNumberValue(i)}</span>
          {:else}
            <span>Unsupported field type: {field.type}</span>
          {/if}
        </div>
        {#if fieldHasAlias(type, field.name, subType, subValue)}
          <div class="field-alias">
            {getFieldAlias(
              type,
              field.name,
              getNumberValue(i) as number,
              subType,
              subValue,
            )}
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
  .field-item {
    display: flex;
    gap: 5px;
  }

  .field-name {
    display: inline-block;
    font-weight: bold;
  }

  .field-value,
  .field-alias {
    display: inline-block;
    margin-right: 5px;
  }
</style>
