<script lang="ts">
  import { tick } from "svelte";
  import type { CompiledFilter } from "../model/filter";
  import type { FilterSymbols } from "../model/filter";
  import { complete, type Completion } from "../model/filter/complete";

  let {
    value = $bindable(""),
    compiled = null,
    symbols = null,
  }: {
    value?: string;
    compiled?: CompiledFilter | null;
    symbols?: FilterSymbols | null;
  } = $props();

  let inputEl: HTMLInputElement | null = $state(null);
  let suggestionsEl: HTMLUListElement | null = $state(null);
  let items: Completion[] = $state([]);
  let selected: number = $state(0);
  let open: boolean = $state(false);
  let replaceStart: number = 0;
  let replaceEnd: number = 0;
  let blurTimer: ReturnType<typeof setTimeout> | null = null;

  const diagnostics = $derived(compiled?.diagnostics ?? []);
  const errors = $derived(diagnostics.filter((d) => d.severity === "error"));
  const warnings = $derived(diagnostics.filter((d) => d.severity === "warning"));

  // Keep the highlighted suggestion inside the scrollable dropdown.
  $effect(() => {
    const list = suggestionsEl;
    if (!list || !open) return;
    const item = list.children[selected] as HTMLElement | undefined;
    if (!item) return;
    const top = item.offsetTop;
    const bottom = top + item.offsetHeight;
    if (top < list.scrollTop) {
      list.scrollTop = top;
    } else if (bottom > list.scrollTop + list.clientHeight) {
      list.scrollTop = bottom - list.clientHeight;
    }
  });

  function refresh() {
    if (!inputEl || !symbols) {
      open = false;
      return;
    }
    const caret = inputEl.selectionStart ?? value.length;
    const result = complete(value, caret, symbols);
    if (result) {
      items = result.items;
      replaceStart = result.start;
      replaceEnd = result.end;
      selected = 0;
      open = true;
    } else {
      items = [];
      open = false;
    }
  }

  async function accept(item: Completion) {
    const insert = item.insert;
    let caret = replaceStart + insert.length;
    if (insert.endsWith("()")) caret -= 1;
    value = value.slice(0, replaceStart) + insert + value.slice(replaceEnd);
    open = false;
    await tick();
    inputEl?.focus();
    inputEl?.setSelectionRange(caret, caret);
    refresh();
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (!open || items.length === 0) return;
    switch (event.key) {
      case "ArrowDown":
        selected = (selected + 1) % items.length;
        break;
      case "ArrowUp":
        selected = (selected + items.length - 1) % items.length;
        break;
      case "Enter":
      case "Tab":
        void accept(items[selected]);
        break;
      case "Escape":
        open = false;
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  function handleBlur() {
    blurTimer = setTimeout(() => {
      open = false;
    }, 120);
  }

  function handleFocus() {
    if (blurTimer) clearTimeout(blurTimer);
  }

  function clearFilter() {
    value = "";
    open = false;
    inputEl?.focus();
  }
</script>

<div class="filter-bar">
  <label class="filter-input">
    <span class="label">Filter:</span>
    <input
      type="text"
      bind:this={inputEl}
      bind:value
      spellcheck="false"
      autocomplete="off"
      class:invalid={errors.length > 0}
      class:warn={errors.length === 0 && warnings.length > 0}
      placeholder='例如 ActorControlSelf.category == 109 && ActorControlSelf.param1 == 231560'
      oninput={refresh}
      onclick={refresh}
      onfocus={handleFocus}
      onkeydown={handleKeyDown}
      onblur={handleBlur}
    />
    <button type="button" class="clear" title="清空" onclick={clearFilter}>×</button>
    {#if open && items.length > 0}
      <ul class="suggestions" role="listbox" bind:this={suggestionsEl}>
        {#each items as item, i}
          <li class:selected={i === selected}>
            <button type="button" onmousedown={(e) => e.preventDefault()} onclick={() => accept(item)}>
              <span class="suggestion-label">{item.label}</span>
              {#if item.detail}
                <span class="suggestion-detail">{item.detail}</span>
              {/if}
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </label>

  {#if diagnostics.length > 0}
    <ul class="diagnostics">
      {#each diagnostics.slice(0, 3) as diagnostic}
        <li class={diagnostic.severity}>
          {diagnostic.message}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .filter-bar {
    position: relative;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: none;
    width: 100%;
    min-width: 0;
  }

  .filter-input {
    display: flex;
    align-items: center;
    gap: 4px;
    position: relative;
    min-width: 0;
  }

  .label {
    font-weight: 600;
    white-space: nowrap;
  }

  input {
    flex: 1;
    min-width: 0;
    height: 24px;
    box-sizing: border-box;
    font-family: "Fira Code", monospace;
    font-size: 12px;
    padding: 2px 6px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }

  input.invalid {
    border-color: #d33;
    background-color: #fff5f5;
  }

  input.warn {
    border-color: #e0a030;
    background-color: #fffaf0;
  }

  .clear {
    padding: 0 6px;
    height: 24px;
    line-height: 1;
    background: none;
    border: none;
    font-size: 14px;
    cursor: pointer;
  }

  .suggestions {
    position: absolute;
    top: 100%;
    left: 48px;
    z-index: 20;
    margin: 2px 0 0;
    padding: 2px 0;
    list-style: none;
    min-width: 260px;
    max-height: 260px;
    overflow-y: auto;
    background: #fff;
    border: 1px solid #bbb;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
    font-family: "Fira Code", monospace;
    font-size: 12px;
  }

  .suggestions li.selected,
  .suggestions li:hover {
    background: #dbe7ff;
  }

  .suggestions button {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
    padding: 2px 8px;
    border: none;
    background: none;
    font: inherit;
    text-align: left;
    cursor: pointer;
    border-radius: 0;
  }

  .suggestion-detail {
    color: #888;
  }

  .diagnostics {
    position: absolute;
    top: 100%;
    left: 48px;
    z-index: 15;
    margin: 3px 0 0;
    padding: 4px 8px;
    list-style: none;
    max-width: 560px;
    font-size: 11px;
    background: #fff;
    border: 1px solid #d33;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
  }

  .diagnostics .error {
    color: #d33;
  }

  .diagnostics .warning {
    color: #b07800;
  }
</style>
