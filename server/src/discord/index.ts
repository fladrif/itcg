import { APIEmbed, Channel, Client, GatewayIntentBits, Message } from 'discord.js';

import { DiscordConfig } from '../config';

import { getMessage } from './messages';
import { gameRooms } from '../gameRooms';

interface TableMessage {
  owner: string;
  challenger?: string;
  message: APIEmbed;
  msgRef: Message;
}

class DiscordBot {
  client: Client;
  tables: Map<string, TableMessage>;
  channel: Channel | null;

  constructor() {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    this.client.login(DiscordConfig.bot_token);
    this.channel = null;

    this.tables = new Map<string, TableMessage>();
  }

  async init() {
    await discordBot.client.guilds.fetch(DiscordConfig.guild_id);
    this.channel = await discordBot.client.channels.fetch(DiscordConfig.channel_id);

    gameRooms.on('create', (id, player) => this.create(id, player));
    gameRooms.on('join', (id, player) => this.join(id, player));
    gameRooms.on('leave', (id) => this.leave(id));
    gameRooms.on('start', (id) => this.start(id));
    gameRooms.on('closed', (id) => this.close(id));

    console.log('Discord Bot Initialized');
  }

  async create(id: string, player: string) {
    if (this.tables.has(id)) return;

    const msgEmbed: APIEmbed = {
      color: 0xb3dfa4,
      title: `${player}'s Table`,
      url: 'https://maple.rs',
      description: getMessage(player),
      fields: [
        {
          name: 'Challenger',
          value: 'Could be you..',
        },
        {
          name: 'Table Opened',
          value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
        },
      ],
    };

    if (this.channel && this.channel.isSendable()) {
      try {
        const msg = await this.channel.send({ embeds: [msgEmbed] });

        this.tables.set(id, { message: msgEmbed, msgRef: msg, owner: player });
      } catch (e) {
        console.error('DiscordBotSendEmbedError:', e);
      }
    }
  }

  async join(id: string, player: string) {
    if (!this.tables.has(id)) return;

    const table = this.tables.get(id)!;
    const tableMsg = table.message;

    tableMsg.color = 0xfcea2a;
    tableMsg.description = getMessage(table.owner, player);
    tableMsg.fields![0] = {
      name: 'Challenger',
      value: player,
    };

    await table.msgRef.edit({ embeds: [tableMsg] });
    this.tables.set(id, { ...table, challenger: player });
  }

  async leave(id: string) {
    if (!this.tables.has(id)) return;

    const table = this.tables.get(id)!;
    const tableMsg = table.message;

    tableMsg.color = 0xb3dfa4;
    tableMsg.description = getMessage(table.owner);
    tableMsg.fields![0] = {
      name: 'Challenger',
      value: 'Could be you..',
    };

    await table.msgRef.edit({ embeds: [tableMsg] });
    this.tables.set(id, { ...table, challenger: undefined });
  }

  async start(id: string) {
    if (!this.tables.has(id)) return;

    const table = this.tables.get(id)!;
    const tableMsg = table.message;

    tableMsg.color = 0xabdeed;
    tableMsg.title = `${table.owner} vs ${table.challenger}`;
    tableMsg.description = `Game started <t:${Math.floor(Date.now() / 1000)}:R>`;
    tableMsg.fields = [];

    await table.msgRef.edit({ embeds: [tableMsg] });
    this.tables.delete(id);
  }

  async close(id: string) {
    if (!this.tables.has(id)) return;
    const table = this.tables.get(id)!;

    await table.msgRef.delete();
    this.tables.delete(id);
  }
}

let discordBot: DiscordBot;

export function getDiscordBot(): DiscordBot {
  if (discordBot) return discordBot;

  return (discordBot = new DiscordBot());
}
