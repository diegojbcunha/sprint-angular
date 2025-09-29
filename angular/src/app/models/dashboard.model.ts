export interface Vehicle {
  id: number;
  modelo: string;
  volumetotal: number;
  connected: number;
  softwareUpdates: number;
  imagem: string;
  codigo?: string;
  odometro?: string;
  nivelCombustivel?: string;
  status?: string;
  latitude?: string;
  longitude?: string;
}

export interface VehicleData {
  codigo: string;
  modelo: string;
  ano: number;
  cor: string;
  status: string;
  vendas: number;
  conectados: number;
  atualizados: number;
  odometro?: string;
  nivelCombustivel?: string;
  latitude?: string;
  longitude?: string;
}

export interface VehicleStats {
  totalVendas: number;
  veiculosConectados: number;
  veiculosAtualizados: number;
}

export interface VehicleApiResponse {
  vehicles: Array<{
    id: number;
    vehicle: string;
    volumetotal: number;
    connected: number;
    softwareUpdates: number;
    img: string;
  }>;
}

export interface VehicleDetailResponse {
  odometro?: string;
  nivelCombustivel?: string;
  status: string;
  lat?: number;
  long?: number;
}