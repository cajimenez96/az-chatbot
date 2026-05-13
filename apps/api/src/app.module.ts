import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LeadsModule } from './leads/leads.module'
import { FAQsModule } from './faqs/faqs.module'
import { ConversationsModule } from './conversations/conversations.module'
import { MetricsModule } from './metrics/metrics.module'
import { AuthModule } from './auth/auth.module'
import { SeedModule } from './database/seed.module'
import { BotModule } from './bot/bot.module'
import { BlocksModule } from './blocks/blocks.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST', 'localhost'),
        port: config.get<number>('DATABASE_PORT', 5432),
        username: config.get('DATABASE_USER', 'chatbot'),
        password: config.get('DATABASE_PASSWORD', 'chatbot_dev'),
        database: config.get('DATABASE_NAME', 'chatbot_db'),
        autoLoadEntities: true,
        synchronize: config.get('NODE_ENV') !== 'production',
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),
    AuthModule,
    LeadsModule,
    FAQsModule,
    BlocksModule,
    ConversationsModule,
    MetricsModule,
    SeedModule,
    BotModule,
  ],
})
export class AppModule {}
