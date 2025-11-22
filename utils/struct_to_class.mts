import type { IPCData, IPCStruct, IPCStructField, IPCTypeAlias } from '../src/model/ipc_struct';
import * as fs from 'fs';

const jsonData = fs.readFileSync("src/data/ipc_structs.json", "utf-8");
const ipcData: IPCData = JSON.parse(jsonData);
const structs = ipcData.structs;

const baseClass = "IpcPacket"

const typeMap: Map<string, string> = new Map([
    ["uint8", "number"],
    ["int8", "number"],
    ["uint16", "number"],
    ["int16", "number"],
    ["uint32", "number"],
    ["int32", "number"],
    ["uint64", "bigint"],
    ["int64", "bigint"],
    ["float", "number"],
    ["double", "number"],
    ["bool", "boolean"],
    ["string", "string"]
]);

let result = '';

result += `// This file is auto-generated. Do not edit directly.\n\n`;
result += `export class ${baseClass} {\n`;
result += `  constructor(dw: DataView, offset: number = 0) {\n`;
result += `    // Base class constructor\n`;
result += `  }\n`;
result += `  static PacketSize(): number {\n`;
result += `    return 0; // Override in derived classes\n`;
result += `  }\n`;
result += `}\n\n`;

let nestedTypes: Map<string, IPCStructField> = new Map();

function getFields(fields: IPCStructField[]): string[] {
    return fields.map(f => `${f.name}: ${typeMap.get(f.type) ?? f.type}${f.arrayLength ? `[]` : ''};`);
}

function getConstructorBody(fields: IPCStructField[]): string[] {
    let result: string[] = [];
    fields.forEach(f => {
        const byteAccessor = f.arrayLength ? `offset + ${f.offset} + i * ${f.size}` : `offset + ${f.offset}`;
        const memberAccessor = f.arrayLength ? `this.${f.name}[i]` : `this.${f.name}`;
        
        let line = '';

        switch (f.type) {
            case 'uint8':
                line = `${memberAccessor} = dw.getUint8(${byteAccessor});`;
                break;
            case 'int8':
                line = `${memberAccessor} = dw.getInt8(${byteAccessor});`;
                break;
            case 'uint16':
                line = `${memberAccessor} = dw.getUint16(${byteAccessor}, true);`;
                break;
            case 'int16':
                line = `${memberAccessor} = dw.getInt16(${byteAccessor}, true);`;
                break;
            case 'uint32':
                line = `${memberAccessor} = dw.getUint32(${byteAccessor}, true);`;
                break;
            case 'int32':
                line = `${memberAccessor} = dw.getInt32(${byteAccessor}, true);`;
                break;
            case 'uint64':
                line = `${memberAccessor} = dw.getBigUint64(${byteAccessor}, true);`;
                break;
            case 'int64':
                line = `${memberAccessor} = dw.getBigInt64(${byteAccessor}, true);`;
                break;
            case 'float':
                line = `${memberAccessor} = dw.getFloat32(${byteAccessor}, true);`;
                break;
            case 'double':
                line = `${memberAccessor} = dw.getFloat64(${byteAccessor}, true);`;
                break;
            case 'bool':
                line = `${memberAccessor} = dw.getUint8(${byteAccessor}) !== 0;`;
                break;
            default:
                if (f.fields && f.fields.length > 0) {
                    // Nested struct
                    nestedTypes.set(f.type, f);
                    line = `${memberAccessor} = new ${f.type}(dw, ${byteAccessor});`;
                    break;
                }
                return `// Unsupported type for field ${f.name}`;
        }

        if (f.arrayLength) {
            result.push(`this.${f.name} = new Array(${f.arrayLength});`)
            result.push(`for (let i = 0; i < ${f.arrayLength}; i++) {`);
            result.push(`  ${line}`);
            result.push(`}`);
            return result;
        } else {
            result.push(line);
        }
    });
    return result;
}

structs.forEach((s) => {
    result += `export class ${s.name} extends ${baseClass} {\n`;
    const fieldLines = getFields(s.fields);
    fieldLines.forEach((line) => {
        result += `  ${line}\n`;
    });
    result += `\n  constructor(dw: DataView, offset: number = 0) {\n`;
    result += `    super(dw, offset);\n`;
    result += `    offset += ${baseClass}.PacketSize();\n`
    const constructorLines = getConstructorBody(s.fields);
    constructorLines.forEach((line) => {
        result += `    ${line}\n`;
    });
    result += `  }\n`;
    result += `}\n`;
});

structs.forEach((s) => {
    nestedTypes.delete(s.name);
});

nestedTypes.forEach((field, typeName) => {
    result += `export class ${typeName} {\n`;
    const fieldLines = getFields(field.fields || []);
    fieldLines.forEach((line) => {
        result += `  ${line}\n`;
    });
    result += `\n  constructor(dw: DataView, offset: number = 0) {\n`;
    const constructorLines = getConstructorBody(field.fields || []);
    constructorLines.forEach((line) => {
        result += `    ${line}\n`;
    });
    result += `  }\n`;
    result += `}\n\n`;
});

fs.writeFileSync("utils/ipc_data.ts", result);