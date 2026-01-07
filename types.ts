
export enum ACMode {
  AUTO = '自动',
  COOL = '制冷',
  DRY = '除湿',
  FAN = '送风',
  HEAT = '制热'
}

export enum FanSpeed {
  AUTO = '自动',
  LOW = '低风',
  MED_LOW = '中低',
  MED = '中风',
  MED_HIGH = '中高',
  HIGH = '高风',
  TURBO = '强劲'
}

export enum IRProtocol {
  GREE_YBOF = 'Gree YBOF (2016-2018)',
  GREE_YB1F2 = 'Gree YB1F2 (2019-2022)',
  GREE_WIFI = 'Gree WiFi (Smart)',
  GREE_LEGACY = 'Gree Legacy (Old)'
}

export interface ACState {
  power: boolean;
  temperature: number;
  mode: ACMode;
  fanSpeed: FanSpeed;
  swingVertical: boolean;
  swingHorizontal: boolean;
  health: boolean;
  light: boolean;
  sleep: boolean;
  energySaving: boolean;
  protocol: IRProtocol;
}
