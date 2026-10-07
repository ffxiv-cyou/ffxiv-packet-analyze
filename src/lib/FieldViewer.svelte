<script lang="ts">
  import { bytesToHex, bytesToString, DataLoader } from "../model/data_utils";
  import type { IPCStructField, IPCTypeAlias } from "../model/ipc_struct";
  import Self from "./FieldViewer.svelte";

  let {
    dw,
    offset,
    field,
    type,
    subType,
    subValue,
    repo,
    path = "",
    subTypeName = "",
    onFilter,
  }: {
    dw: DataView;
    offset: number;
    field: IPCStructField;
    type: string;
    subType?: string;
    subValue?: number;
    repo: DataLoader;
    /** dotted filter path prefix, e.g. "ActorControlSelf" */
    path?: string;
    /** sub type segment to insert, e.g. "LogMsg" */
    subTypeName?: string;
    onFilter?: (expr: string) => void;
  } = $props();

  let basePath = $derived(subTypeName ? `${path}.${subTypeName}` : path);
  let fieldPath = $derived(`${basePath}.${field.name}`);

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
        return dw.getBigUint64(offset + i * 8, true);
      case "int64":
        return dw.getBigInt64(offset + i * 8, true);
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

  function getEnumValue(i: number): string | undefined {
    const rawValue = getEnumRawValue(i);
    const enumName = repo.getEnumValue(field.type, rawValue as number);
    if (enumName !== null) {
      return enumName + ` (${rawValue})`;
    }
    return rawValue?.toString();
  }

  function getAlias(i: number): string | null {
    if (!repo.fieldHasAlias(type, field.name, subType, subValue)) return null;
    const raw = getNumberValue(i) ?? getEnumRawValue(i);
    if (raw === undefined) return null;
    return repo.getFieldAlias(type, field.name, Number(raw), subType, subValue);
  }

  function isBareIdentifier(text: string): boolean {
    return /^[\p{L}_$][\p{L}\p{N}_$]*$/u.test(text);
  }

  function numericLiteral(value: number | bigint): string {
    return typeof value === "bigint" ? value.toString() : String(value);
  }

  function addNumberFilter(i: number) {
    if (!onFilter) return;
    const raw = getNumberValue(i) ?? getEnumRawValue(i);
    if (raw === undefined) return;
    const alias = getAlias(i);
    const literal = alias && isBareIdentifier(alias) ? alias : numericLiteral(raw);
    const suffix = (field.arrayLength || 0) > 1 ? `[${i}]` : "";
    onFilter(`${fieldPath}${suffix} == ${literal}`);
  }

  function addStringFilter() {
    if (!onFilter) return;
    onFilter(`${fieldPath} == ${JSON.stringify(bytesToString(dw, offset, field.arrayLength))}`);
  }

  let isStringLike = $derived(
    (field.type === "int8" || field.type === "uint8") &&
      (field.arrayLength || 0) > 1 &&
      /name$/i.test(field.name),
  );
</script>

<div class="field-item">
  <div class="field-name">{field.name}:</div>
  {#if (field.type === "int8" || field.type === "uint8") && (field.arrayLength || 0) > 1}
    {#if isStringLike}
      <span>{bytesToString(dw, offset, field.arrayLength)}</span>
      {#if onFilter}
        <button type="button" class="filter-btn" title="添加为过滤条件" onclick={addStringFilter}>filter</button>
      {/if}
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
                {repo}
                path={(field.arrayLength || 0) > 1 ? `${fieldPath}[${i}]` : fieldPath}
                {onFilter}
              />
            {/each}
          {:else if getEnumValue(i) !== undefined}
            <span>{getEnumValue(i)}</span>
            {#if onFilter}
              <button type="button" class="filter-btn" title="添加为过滤条件" onclick={() => addNumberFilter(i)}>filter</button>
            {/if}
          {:else if getNumberValue(i) !== undefined}
            <span>{getNumberValue(i)}</span>
            {#if onFilter}
              <button type="button" class="filter-btn" title="添加为过滤条件" onclick={() => addNumberFilter(i)}>filter</button>
            {/if}
          {:else}
            <span>Unsupported field type: {field.type}</span>
          {/if}
        </div>
        {#if repo.fieldHasAlias(type, field.name, subType, subValue)}
          <div class="field-alias">
            {repo.getFieldAlias(
              type,
              field.name,
              Number(getNumberValue(i) ?? getEnumRawValue(i) ?? 0),
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

  .filter-btn {
    padding: 0 4px;
    border: 1px solid #ccc;
    background: #f5f5f5;
    color: #666;
    font-size: 10px;
    line-height: 1.2;
    border-radius: 3px;
    cursor: pointer;
    vertical-align: middle;
  }

  .filter-btn:hover {
    background: #e0e8ff;
    color: #04a;
  }
</style>
