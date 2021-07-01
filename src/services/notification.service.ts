import { injectable } from 'inversify';
import { Client } from 'onesignal-node';
import { ClientResponse } from 'onesignal-node/lib/types';
import { CONFIG } from '../../src/config';
import * as oneSignal from 'onesignal-node';

@injectable()
export class NotificationService {

  private _client: Client;

  constructor() {
    this._client = new oneSignal.Client(CONFIG.ONE_SIGNAL_APP_ID, CONFIG.ONE_SIGNAL_API_KEY);
  }

  public async createNotification(usersKeys: string[], options: {
      title: string,
      message: string
  }): Promise<ClientResponse> {
      
    const response: ClientResponse = await this._client.createNotification({
      include_external_user_ids: usersKeys,
      channel_for_external_user_ids: 'push',
      android_channel_id: '57917f77-c7df-4be2-99e8-619006f0c652',
      headings: {
        en: options.title
      },
      contents: {
        en: options.message
      },
    });

    return response;
  };
}
