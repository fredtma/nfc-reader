import { Component, inject, OnInit } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-nfc-reader',
  templateUrl: './nfc-reader.component.html',
  styleUrl: './nfc-reader.component.css',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule
  ]
})
export class NfcReaderComponent implements OnInit {
  private fb = inject(FormBuilder);
  private permissionGranted = false;
  private abortController!: AbortController;

  form = this.fb.group({
    status: null,
    cardType: [null, Validators.required],
    cardSerial: [null, Validators.required],
  });

  async ngOnInit(): Promise<void> {
    const permissionStatus: PermissionStatus = await navigator.permissions.query({ name: 'nfc' as PermissionName });
    if (permissionStatus.state === 'granted') {
      this.permissionGranted = 'NDEFReader' in window;
    }
  }

  onSubmit(): void {
    alert('Thanks!');
  }

  cancel() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  async scan() {
    if (!this.permissionGranted) {
      return console.warn('Permission is not grantted of NFC not supported');
    }
    try {
      this.abortController = new AbortController();
      const ndef = new (window as any).NDEFReader();
      await ndef.scan({ signal: this.abortController.signal });

      ndef.addEventListener("readingerror", () => {
        console.log("Argh! Cannot read data from the NFC tag. Try another one?");
      });

      ndef.addEventListener("reading", ({ message, serialNumber }: any) => {
        this.form.get('cardType')?.setValue(message.type);
        this.form.get('cardSerial')?.setValue(serialNumber);
        console.log(`> Serial Number: ${serialNumber}`);
        console.log(`> Records: (${message.records.length})`);
      });
    } catch (error: unknown) {
      console.error((error as Error).message);
    }
  }

  async write() {
    try {
      const ndef = new (window as any).NDEFReader();
      await ndef.write("Hello world!");
      console.info("> Message written");
    } catch (error: unknown) {
      console.error((error as Error).message);
    }
  }

  async markAsReadOnly() {
    try {
      const ndef = new (window as any).NDEFReader();
      await ndef.markAsReadOnly();
      console.info("> NFC tag has been made permanently read-only");
    } catch (error: unknown) {
      console.error((error as Error).message);
    }
  }
}
