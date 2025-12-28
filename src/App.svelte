<script lang="ts">
  import overlayToolkit from "overlay-toolkit";
  import type { Packet } from "overlay-toolkit";
  import PacketViewer from "./lib/PacketViewer.svelte";
  import { createPcapFile, importPcapFile } from "./model/pcap";
  import { importFFXIVMonData } from "./model/ffxivmon";
  import { DataLoader } from "./model/data_utils";

  overlayToolkit.Start();

  let packets: Packet[] = $state([]);
  const repo = new DataLoader();

  function onReceivePacket(packet: Packet) {
    packets.push(packet);
  }

  function startCapture() {
    overlayToolkit.SubscribePacket("otk-packet", [], onReceivePacket);
  }

  function stopCapture() {
    overlayToolkit.UnsubscribePacket("otk-packet");
  }

  function clearPackets() {
    packets = [];
  }

  function exportPackets() {
    const pcap = createPcapFile(packets);
    const blob = new Blob([pcap], { type: "application/vnd.tcpdump.pcap" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "packets.pcap";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importPackets(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const buffer = e.target?.result as ArrayBuffer;
        if (file.name.endsWith(".pcap")) {
          const importedPackets = importPcapFile(buffer);
          packets = importedPackets.map((p) => ({
            epoch: p.epoch,
            dir: p.dir,
            data: p.data,
            opcode: p.opcode,
            type: "imported",
            name: "imported",
            conn: "",
            length: p.data.length,
          }));
          return;
        }
        if (file.name.endsWith(".xml")) {
          const importedPackets = importFFXIVMonData(buffer);
          packets = importedPackets.map((p) => ({
            epoch: p.epoch,
            dir: p.dir,
            data: p.data,
            opcode: p.opcode,
            type: "imported",
            name: "imported",
            conn: "",
            length: p.data.length,
          }));
          return;
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  repo.loadVersions();
</script>

<main>
  <h1>FFXIV Packet Analyzer</h1>
  <div>
    <button onclick={startCapture}>Start Capture</button>
    <button onclick={stopCapture}>Stop Capture</button>
    <button onclick={clearPackets}>Clear Packets</button>
    <button onclick={exportPackets}>Export Packets</button>
    <label for="version-select">Version</label>
    <select
      id="version-select"
      value={repo.version}
      onchange={(ev) => repo.loadVersion(ev.target.value)}
    >
      {#each repo.versionList as version}
        <option value={version}>{version}</option>
      {/each}
    </select>
    <label for="file">Import</label>
    <input
      type="file"
      id="file"
      accept=".pcap,.xml"
      onchange={importPackets}
      name="pcapFile"
    />
  </div>

  <div class="card">
    <PacketViewer {packets} {repo} />
  </div>
</main>

<style>
</style>
