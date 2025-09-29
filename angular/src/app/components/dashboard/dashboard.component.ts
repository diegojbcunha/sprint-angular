import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { startWith, filter, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  Vehicle,
  VehicleData,
  VehicleStats,
  VehicleApiResponse,
  VehicleDetailResponse
} from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly API_URL = 'http://localhost:3001';
  private readonly searchModelSubject = new BehaviorSubject<string>('');
  private searchSubscription?: Subscription;

  vehicles: Vehicle[] = [];
  selectedVehicle: Vehicle | null = null;
  loading = true;
  error: string | null = null;
  
  searchModel = '';
  searchCode = '';
  
  vehicleData: VehicleData[] = [];
  filteredData: VehicleData[] = [];
  
  stats: VehicleStats = {
    totalVendas: 0,
    veiculosConectados: 0,
    veiculosAtualizados: 0
  };

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeDashboard();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  private async initializeDashboard(): Promise<void> {
    this.loading = true;
    this.error = null;
    
    try {
      await Promise.all([
        this.loadVehicles(),
        this.loadVehicleData()
      ]);
      this.setupReactiveSearch();
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      if (!this.error) {
        this.error = 'Erro ao carregar dados do dashboard';
      }
    } finally {
      this.loading = false;
    }
  }

  private loadVehicles(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get<VehicleApiResponse>(`${this.API_URL}/vehicles`).subscribe({
        next: (data) => {
          this.vehicles = data.vehicles.map(v => ({
            id: v.id,
            modelo: v.vehicle,
            volumetotal: v.volumetotal,
            connected: v.connected,
            softwareUpdates: v.softwareUpdates,
            imagem: v.img.split('/').pop() || '',
          }));
          resolve();
        },
        error: (err) => {
          console.error('Erro ao carregar veículos:', err);
          this.error = 'Erro ao carregar lista de veículos';
          reject(err);
        }
      });
    });
  }

  private loadVehicleData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get<VehicleData[]>(`${this.API_URL}/vehicleData`).subscribe({
        next: (data) => {
          const mappedData = data.map(item => ({
            ...item,
            status: item.status === 'Conectado' || item.status === 'on' ? 'Conectado' : 'Desconectado'
          }));
          this.vehicleData = this.sortVehicleData(mappedData);
          this.filteredData = this.sortVehicleData([...mappedData]);
          resolve();
        },
        error: (err) => {
          console.error('Erro ao carregar dados dos veículos:', err);
          this.error = 'Erro ao carregar dados dos veículos';
          reject(err);
        }
      });
    });
  }

  onVehicleSelect(): void {
    this.searchCode = '';

    if (this.selectedVehicle) {
      this.searchModel = this.selectedVehicle.modelo;
      this.filterDataByModel(this.selectedVehicle.modelo);
      this.loadFirstVehicleDetails();
      this.updateStats();
      console.log('Veículo selecionado:', this.selectedVehicle.modelo);
    } else {
      this.resetToAllVehicles();
    }
  }

  private filterDataByModel(modelo: string): void {
    this.filteredData = this.vehicleData.filter(v =>
      v.modelo.toLowerCase() === modelo.toLowerCase()
    );
  }

  private loadFirstVehicleDetails(): void {
    if (this.filteredData.length > 0) {
      const firstVin = this.filteredData[0].codigo;
      if (firstVin) {
        this.loadDetailedVehicleData(firstVin);
      }
    }
  }

  private resetToAllVehicles(): void {
    this.searchModel = '';
    this.filteredData = this.sortVehicleData([...this.vehicleData]);
    this.updateStats();
    this.clearVehicleDetails();
  }

  private loadDetailedVehicleData(vin: string): void {
    this.http.post<VehicleDetailResponse>(`${this.API_URL}/vehicleData`, { vin }).subscribe({
      next: (data) => this.updateSelectedVehicleDetails(vin, data),
      error: (err) => this.handleDetailedDataError(vin, err)
    });
  }

  private updateSelectedVehicleDetails(vin: string, data: VehicleDetailResponse): void {
    if (this.selectedVehicle) {
      this.selectedVehicle.codigo = vin;
      this.selectedVehicle.odometro = data.odometro ? `${data.odometro} Km` : 'N/A';
      this.selectedVehicle.nivelCombustivel = data.nivelCombustivel ? `${data.nivelCombustivel}%` : 'N/A';
      this.selectedVehicle.status = data.status === 'on' ? 'Conectado' : 'Desconectado';
      this.selectedVehicle.latitude = data.lat?.toString() || 'N/A';
      this.selectedVehicle.longitude = data.long?.toString() || 'N/A';
    }
  }

  private handleDetailedDataError(vin: string, err: any): void {
    console.error('Erro ao carregar dados detalhados do veículo:', err);
    this.setDefaultVehicleDetails(vin);
  }

  private setDefaultVehicleDetails(vin: string): void {
    if (this.selectedVehicle) {
      this.selectedVehicle.codigo = vin;
      this.selectedVehicle.odometro = 'N/A';
      this.selectedVehicle.nivelCombustivel = 'N/A';
      this.selectedVehicle.status = 'Desconectado';
      this.selectedVehicle.latitude = 'N/A';
      this.selectedVehicle.longitude = 'N/A';
    }
  }

  private clearVehicleDetails(): void {
    if (this.selectedVehicle) {
      this.selectedVehicle.codigo = undefined;
      this.selectedVehicle.odometro = undefined;
      this.selectedVehicle.nivelCombustivel = undefined;
      this.selectedVehicle.status = undefined;
      this.selectedVehicle.latitude = undefined;
      this.selectedVehicle.longitude = undefined;
    }
  }

  private updateStats(): void {
    if (this.selectedVehicle) {
      const vehicleFromApi = this.vehicles.find(v => v.modelo === this.selectedVehicle!.modelo);
      if (vehicleFromApi) {
        this.stats = {
          totalVendas: vehicleFromApi.volumetotal,
          veiculosConectados: vehicleFromApi.connected,
          veiculosAtualizados: vehicleFromApi.softwareUpdates
        };
        return;
      }
    }

    this.resetStats();
  }

  private resetStats(): void {
    this.stats = {
      totalVendas: 0,
      veiculosConectados: 0,
      veiculosAtualizados: 0
    };
  }

  onSearchChange(value: string): void {
    this.searchCode = value;
    this.filterByVinCode(value);
  }

  private filterByVinCode(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.resetFilterToSelectedVehicle();
    } else {
      this.filterBySearchTerm(searchTerm);
    }
    
    if (this.selectedVehicle) {
      this.updateStats();
    }
  }

  private resetFilterToSelectedVehicle(): void {
    if (this.selectedVehicle) {
      this.filteredData = this.vehicleData.filter(v =>
        v.modelo.toLowerCase() === this.selectedVehicle!.modelo.toLowerCase()
      );
    } else {
      this.filteredData = [...this.vehicleData];
    }
  }

  private filterBySearchTerm(searchTerm: string): void {
    this.filteredData = this.vehicleData.filter(vehicle =>
      vehicle.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  private setupReactiveSearch(): void {
    this.searchSubscription = this.searchModelSubject.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(model => model.trim().toLowerCase()),
      filter(model => model.length > 0),
    ).subscribe(modelSearch => {
      this.selectedVehicle = this.vehicles.find(v =>
        v.modelo.toLowerCase() === modelSearch
      ) || null;

      if (this.selectedVehicle) {
        this.filteredData = this.vehicleData.filter(v =>
          v.modelo.toLowerCase() === modelSearch
        );
        this.updateStats();
      }
    });
  }

  private sortVehicleData(data: VehicleData[]): VehicleData[] {
    return data.sort((a, b) => {
      if (a.modelo < b.modelo) return -1;
      if (a.modelo > b.modelo) return 1;
      return b.ano - a.ano;
    });
  }

  clearSearch(): void {
    this.searchModel = '';
    this.searchCode = '';
    this.selectedVehicle = null;
    this.filteredData = this.sortVehicleData([...this.vehicleData]);
    this.clearVehicleDetails();
    this.resetStats();
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement && this.selectedVehicle?.modelo) {
      const vehicleName = this.selectedVehicle.modelo;
      imgElement.src = `https://via.placeholder.com/300x150?text=${encodeURIComponent(vehicleName)}`;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
