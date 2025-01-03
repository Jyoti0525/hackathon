// websocket/universityWebSocket.js
const WebSocket = require('ws');
const UniversityDashboardService = require('../services/universityDashboardService');

class UniversityWebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map(); // Store client connections with university IDs
    
    this.wss.on('connection', (ws, req) => {
      this.handleConnection(ws, req);
    });
  }

  handleConnection(ws, req) {
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        
        if (data.type === 'subscribe') {
          this.clients.set(ws, data.universityId);
          await this.sendInitialData(ws, data.universityId);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      this.clients.delete(ws);
    });
  }

  async sendInitialData(ws, universityId) {
    try {
      const dashboardData = await this.getDashboardData(universityId);
      ws.send(JSON.stringify({
        type: 'dashboard_update',
        data: dashboardData
      }));
    } catch (error) {
      console.error('Error sending initial data:', error);
    }
  }

  async getDashboardData(universityId) {
    const [metrics, recentPlacements, upcomingDrives] = await Promise.all([
      UniversityDashboardService.calculateDashboardMetrics(universityId),
      UniversityDashboardService.getRecentPlacements(universityId),
      UniversityDashboardService.getUpcomingDrives(universityId)
    ]);

    return {
      metrics,
      recentPlacements,
      upcomingDrives
    };
  }

  broadcast(universityId, data) {
    this.clients.forEach((clientUniversityId, client) => {
      if (clientUniversityId === universityId && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}

module.exports = UniversityWebSocketServer;