import * as Linking from 'expo-linking';
import * as SMS from 'expo-sms';
import * as Contacts from 'expo-contacts';
import * as Notifications from 'expo-notifications';
import type { SkillCall } from '../types';

export interface NativeOutcome {
  success: boolean;
  message: string;
}

export async function openDialer(phoneNumber: string): Promise<void> {
  const url = `tel:${phoneNumber}`;
  const supported = await Linking.canOpenURL(url);
  if (!supported) throw new Error('Phone calls not supported on this device');
  await Linking.openURL(url);
}

export async function openSMS(phoneNumber: string, body: string): Promise<void> {
  const available = await SMS.isAvailableAsync();
  if (!available) throw new Error('SMS not available on this device');
  await SMS.sendSMSAsync([phoneNumber], body);
}

export async function searchContacts(name: string): Promise<Contacts.ExistingContact[]> {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== 'granted') throw new Error('Contacts permission denied');
  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
    name,
  });
  return data;
}

export async function scheduleReminder(
  title: string,
  body: string,
  triggerSeconds: number
): Promise<void> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') throw new Error('Notifications permission denied');
  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: triggerSeconds },
  });
}

/**
 * Ejecuta en el dispositivo la acción nativa decidida (y confirmada) por el
 * backend. Aquí se cumple la arquitectura de la tesis: el backend decide,
 * el teléfono ejecuta.
 */
export async function executeSkillCall(skillCall: SkillCall): Promise<NativeOutcome> {
  try {
    switch (skillCall.name) {
      case 'make_call': {
        const phone = String(skillCall.args.phoneNumber ?? '');
        const name = String(skillCall.args.contactName ?? phone);
        await openDialer(phone);
        return { success: true, message: `Abriendo el marcador para llamar a ${name}…` };
      }
      case 'send_sms': {
        const phone = String(skillCall.args.phoneNumber ?? '');
        const name = String(skillCall.args.contactName ?? phone);
        const body = String(skillCall.args.body ?? '');
        await openSMS(phone, body);
        return { success: true, message: `Abriendo mensajes para ${name}…` };
      }
      case 'schedule_reminder': {
        const title = String(skillCall.args.title ?? 'Aurora');
        const body = String(skillCall.args.body ?? '');
        const seconds = Number(skillCall.args.seconds ?? 3600);
        await scheduleReminder(title, body, seconds);
        return { success: true, message: 'Recordatorio programado en tu teléfono.' };
      }
      default:
        return { success: false, message: 'Esa acción todavía no la sé hacer en el teléfono.' };
    }
  } catch (e) {
    return { success: false, message: friendlyNativeError(e) };
  }
}

/** Traduce errores técnicos a lenguaje claro para personas mayores. */
function friendlyNativeError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (/permission/i.test(msg)) {
    return 'Necesito tu permiso para hacer eso. Revísalo en la configuración del teléfono.';
  }
  return 'No pude hacerlo en el teléfono. Probemos de nuevo.';
}
