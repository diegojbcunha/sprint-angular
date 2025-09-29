export interface Veiculos extends Array<Veiculo> {}

export interface Veiculo {
  id: number;
  vehicle: string;
  volumetotal: number;
  connected: number;
  softwareUpdates: number;
}

export interface VeiculosAPI {
  vehicles: Veiculos;
}
