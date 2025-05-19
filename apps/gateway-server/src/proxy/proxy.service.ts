import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Request, Response } from 'express';
import { AxiosRequestConfig, AxiosError, Method } from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  constructor(private readonly httpService: HttpService) {}

  async proxyToService(serviceUrl: string, req: Request, res: Response) {
    if (!serviceUrl) {
      this.logger.error(
        `Target service URL is not defined for request: ${req.originalUrl}`,
      );
      return res.status(503).json({
        message: 'Target service is currently unavailable or not configured.',
      });
    }

    const { method, originalUrl, body, headers, user } = req;
    const targetUrl = `${serviceUrl}${originalUrl}`;
    this.logger.log(`Proxying [${method}] ${originalUrl} -> ${targetUrl}`);

    const requestConfig: AxiosRequestConfig = {
      method: method as Method,
      url: targetUrl,
      data: body,
      headers: {
        ...(user && {
          'x-user-id': (user as any).userId,
          'x-user-name': (user as any).username,
          'x-user-role': (user as any).role,
        }),
      },
      validateStatus: (status) => status < 500,
    };

    try {
      const serviceResponse = await firstValueFrom(
        this.httpService.request(requestConfig),
      );
      res.status(serviceResponse.status).json(serviceResponse.data);
    } catch (error) {
      this.logger.error(
        `Error proxying to ${targetUrl}: ${error.message}`,
        error.stack,
      );
      res.status(500).json({
        statusCode: 500,
        message: 'Internal Gateway Error: An unexpected error occurred.',
        error: 'Internal Server Error',
      });
    }
  }
}
