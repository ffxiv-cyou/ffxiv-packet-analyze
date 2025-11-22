  struct FFXIVIpcStatusEffectList2 : FFXIVIpcBasePacket< StatusEffectList2 >
  {
    uint32_t unknown3;
    uint8_t classId;
    uint8_t level1;
    uint8_t level2;
    uint8_t level3;
    uint32_t current_hp;
    uint32_t max_hp;
    uint16_t current_mp;
    uint16_t max_mp;
    uint8_t shieldPercentage;
    uint8_t unknown1;
    uint16_t unknown2;
    Common::StatusEffect effect[30];
  };

  struct FFXIVIpcStatusEffectList3 : FFXIVIpcBasePacket< StatusEffectList3 >
  {
    Common::StatusEffect effect[30];
  };

  struct FFXIVIpcSystemLogMessage : FFXIVIpcBasePacket< SystemLogMessage >
  {
    uint32_t eventId;
    uint32_t messageId;
    uint32_t paramSize;
    uint32_t param1;
    uint32_t param2;
    uint32_t padding;
  };

  enum WaymarkStatus : uint8_t
  {
    WaymarkOff = 0,
    WaymarkOn = 1,
  };

  enum WaymarkType : uint8_t 
  {
    A = 1,
    B = 2,
    C = 4,
    D = 8,
    One = 16,
    Two = 32,
    Three = 64,
    Four = 128,
  };

  struct FFXIVIpcWaymark : FFXIVIpcBasePacket< Waymark >
  {
    WaymarkType type;
    WaymarkStatus status;
    uint16_t padding;
    int x;
    int y;
    int z;
  };
  
  struct FFXIVIpcEventPlay4 : FFXIVIpcBasePacket< EventPlay4 >
  {
    uint64_t actorId;
    uint32_t eventId;
    uint16_t scene;
    uint16_t padding;
    uint32_t flags;
    uint32_t param3;
    uint32_t paramSize;
    uint32_t param[4];
    uint32_t padding;
  };
  
  struct FFXIVIpcGuessTargetAction : FFXIVIpcBasePacket < GuessTargetAction >
  {
    uint16_t unknown00;
    uint16_t unknown02;
    uint32_t actionId;
    uint16_t sequence;
    uint16_t unknown0a;
    uint16_t unknown0c;
    uint16_t unknown0e;
    uint32_t targetId;
    uint32_t padding14;
    uint32_t param1;
    uint32_t unknown1c;
  };