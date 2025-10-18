import { ChangeDetectionStrategy, Component, WritableSignal, signal, computed, Signal } from '@angular/core';

@Component({
  selector: 'app-signal',
  standalone: true,
  imports: [],
  templateUrl: './signal.component.html',
  styleUrl: './signal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalComponent {
  status: WritableSignal<string> = signal('');
  value: Signal<string> = computed(() => `${this.status()}: changed`);

  changeStatus(value: string) {
    this.status.set(value);
  }
}
