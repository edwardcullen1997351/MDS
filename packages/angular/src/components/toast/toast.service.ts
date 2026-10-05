import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type DsToastStatus = 'info' | 'success' | 'warning' | 'error';

export interface DsToastData {
  id: string;
  title: string;
  description?: string;
  status?: DsToastStatus;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

@Injectable({
  providedIn: 'root',
})
export class DsToastService {
  private toastsSubject = new BehaviorSubject<DsToastData[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  show(options: Omit<DsToastData, 'id'>): string {
    const id = `ds-toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast: DsToastData = {
      id,
      duration: 5000,
      status: 'info',
      ...options,
    };

    const current = this.toastsSubject.value;
    this.toastsSubject.next([...current, newToast]);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, newToast.duration);
    }

    return id;
  }

  success(title: string, description?: string): string {
    return this.show({ title, description, status: 'success' });
  }

  error(title: string, description?: string): string {
    return this.show({ title, description, status: 'error' });
  }

  warning(title: string, description?: string): string {
    return this.show({ title, description, status: 'warning' });
  }

  info(title: string, description?: string): string {
    return this.show({ title, description, status: 'info' });
  }

  dismiss(id: string): void {
    const current = this.toastsSubject.value;
    this.toastsSubject.next(current.filter((t) => t.id !== id));
  }
}
