<script lang="ts">
  import overlayToolkit from "overlay-toolkit-lib";
  import type { Packet } from "overlay-toolkit-lib";
  import PacketViewer from "./lib/PacketViewer.svelte";
  import { createPcapFile, importPcapFile } from "./model/pcap";

  overlayToolkit.Start();

  let packets: Packet[] = $state([]);

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
        const importedPackets = importPcapFile(buffer);
        packets.push(
          ...importedPackets.map((p) => ({
            epoch: p.epoch,
            dir: p.dir,
            data: p.data,
            opcode: p.opcode,
            type: "imported",
            name: "imported",
            conn: "",
            length: p.data.length,
          })),
        );
      };
      reader.readAsArrayBuffer(file);
    }
  }
</script>

<main>
  <h1>Vite + Svelte</h1>

  <button onclick={startCapture}>Start Capture</button>
  <button onclick={stopCapture}>Stop Capture</button>
  <button onclick={clearPackets}>Clear Packets</button>
  <button onclick={exportPackets}>Export Packets</button>
  <label for="file">Import</label>
  <input type="file" id="file" accept=".pcap" onchange={importPackets} name="pcapFile" />

  <div class="card">
    <PacketViewer {packets} />
  </div>
</main>

<style>
</style>
