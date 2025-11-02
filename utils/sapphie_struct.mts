import type { IPCData, IPCStruct, IPCStructField, IPCTypeAlias } from '../src/model/ipc_struct';

import * as fs from 'fs';

const structRegexp = /^\s*struct (\w+)\s*(?::\s*(\w+)\s*)?(?:<\s*(\w+)\s*>\s*)?\s*\{([\s\S]+?)\}/mg
const fieldRegexp = /^(\s*\/\*[0-9a-fA-F ]+\*\/)?\s*([::\w]+)\s+(\w+?)(?:\[\s*([xa-fA-F0-9]+)\s*\])?\s*;/mg
const enumRegexp = /enum (class|struct)? ?(\w+)(?:\s*:\s*(\w+))?\s+\{([\s\S]+?)\}/g
const enumItemRegexp = /^\s*(\w+)(?: ?= ?([xa-fA-F0-9]+))?/mg

const typeMappings: Record<string, { type: string, size: number, fields?: IPCStructField[] }> = {
  'char': { type: 'int8', size: 1 },
  'byte': { type: 'uint8', size: 1 },
  'bool': { type: 'bool', size: 1 },
  'uint8_t': { type: 'uint8', size: 1 },
  'int8_t': { type: 'int8', size: 1 },
  'uint16_t': { type: 'uint16', size: 2 },
  'int16_t': { type: 'int16', size: 2 },
  'uint32_t': { type: 'uint32', size: 4 },
  'int32_t': { type: 'int32', size: 4 },
  'uint64_t': { type: 'uint64', size: 8 },
  'int64_t': { type: 'int64', size: 8 },
  'float': { type: 'float', size: 4 },
  'double': { type: 'double', size: 8 },
  'int': { type: 'int32', size: 4 },
  'uint': { type: 'uint32', size: 4 },
  'short': { type: 'int16', size: 2 },
  'ushort': { type: 'uint16', size: 2 },
  'FFXIVARR_POSITION3': {
    type: 'FFXIVARR_POSITION3',
    size: 12,
    fields: [
      { name: 'X', type: 'float', offset: 0, size: 4 },
      { name: 'Y', type: 'float', offset: 4, size: 4 },
      { name: 'Z', type: 'float', offset: 8, size: 4 },
    ]
  }
}

function execAll(content: string, regexp: RegExp) {
  const results = [];
  let match;
  while ((match = regexp.exec(content)) !== null) {
    results.push(match);
  }
  return results;
}

class SapphieStructParser {
  structs: IPCStruct[] = [];
  enums: IPCTypeAlias[] = [];

  constructor() { }

  parseEnums(content: string) {
    execAll(content, enumRegexp).forEach(match => {
      const enumName = match[2];
      const baseType = match[3];
      const body = match[4];

      let enumValues: { [key: number]: string } = {};
      execAll(body, enumItemRegexp).forEach(itemMatch => {
        const itemName = itemMatch[1];
        const itemValue = itemMatch[2] ? parseInt(itemMatch[2], 16) : Object.keys(enumValues).length;
        enumValues[itemValue] = itemName;
      });

      let size = 4; // default to uint32
      if (baseType) {
        const mapping = typeMappings[baseType];
        if (mapping) {
          size = mapping.size;
        }
      }

      this.enums.push({ name: enumName, size, enum: enumValues });
    });
  }

  pushField(struct: IPCStruct, field: IPCStructField) {
    let offset = struct.size;
    field.offset = offset;
    offset += field.size * (field.arrayLength || 1);
    struct.fields.push(field);
    struct.size = offset;
  }

  parseStructs(content: string) {
    execAll(content, structRegexp).forEach(match => {
      const structName = match[1];
      const baseStruct = match[2];
      const ipcName = match[3];
      const body = match[4];

      let struct = {
        name: structName,
        ipcName: ipcName,
        fields: [] as IPCStructField[],
        size: 0,
      };

      execAll(body, fieldRegexp).forEach(fieldMatch => {
        let type = fieldMatch[2];
        const name = fieldMatch[3];
        const arrayLength = fieldMatch[4] ? parseInt(fieldMatch[4]) : undefined;

        if (type.startsWith("Common::"))
          type = type.substring(8);

        let field: IPCStructField = {
          name: name,
          type: type,
          arrayLength: arrayLength,
          offset: 0,
          size: 0,
        }

        const knownType = typeMappings[type];
        if (knownType) {
          field = Object.assign(field, knownType);
          this.pushField(struct, field);
          return;
        }

        const knownStruct = this.structs.find(s => s.name === type);
        if (knownStruct) {
          field.size = knownStruct.size;
          field.fields = knownStruct.fields;
          this.pushField(struct, field);
          return;
        }

        const knownEnum = this.enums.find(e => e.name === type);
        if (knownEnum) {
          field.size = knownEnum.size;
          this.pushField(struct, field);
          return;
        }

        console.log(`Unknown type: ${type} in struct ${structName}`);
      });

      this.structs.push(struct);
    });
  }

  parseContent(content: string) {
    this.parseEnums(content);
    this.parseStructs(content);
  }

  parseFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    this.parseContent(content);
  }

  result(): IPCData {
    return { structs: this.structs, enums: this.enums };
  }

  writeToFile(filePath: string) {
    const data = this.result();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
  }
}

const parser = new SapphieStructParser();
parser.parseFile('utils/Common.h');
parser.parseFile('utils/ClientZoneDef.h');
parser.parseFile('utils/ServerZoneDef.h');
parser.parseFile('utils/ExtraDef.h');

parser.writeToFile('src/data/ipc_structs.json');

const enums = new SapphieStructParser();
enums.parseFile('utils/CommonActorControl.h');
let enumMapping : {[key: string]: {[key: number]: string | undefined}} = {};
enums.enums.forEach(element => {
  enumMapping[element.name] = element.enum;
});

fs.writeFileSync('src/data/ipc_extra_enum.json', JSON.stringify(enumMapping, null, 4));

