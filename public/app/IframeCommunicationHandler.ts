import { locationService } from '@grafana/runtime';
import { getDashboardSrv } from 'app/features/dashboard/services/DashboardSrv';

import { changeTheme } from './core/services/theme';
import { getDashboardSceneSerializer } from './features/dashboard-scene/serialization/DashboardSceneSerializer';
import { DashboardModelCompatibilityWrapper } from './features/dashboard-scene/utils/DashboardModelCompatibilityWrapper';

export class IframeCommunicationHandler {
  private messageListener: (event: MessageEvent) => void;
  // private locationSubscription: Observable<Location>;


  constructor() {
    // Define the message listener
    this.messageListener = this.handleMessage.bind(this);

    locationService.getLocationObservable().subscribe(() => {
      const queryParams = locationService.getSearchObject();
      if (queryParams.editPanel) {
        parent.postMessage({ type: 'editMode', editMode: true }, '*');
      }
    });
  }

  setupEventListeners() {
    window.addEventListener('message', this.messageListener);
  }

  disposeEventListeners() {
    window.removeEventListener('message', this.messageListener);
  }

  private async handleMessage(event: MessageEvent) {
    if (event.data) {
      switch (event.data.type) {
        case 'requestDashboardContent':
          try {
            const dashboardContent = await this.getDashboardContent();
            console.log(dashboardContent);
            const dashboardContentJson = JSON.stringify(dashboardContent);
            parent.postMessage({ type: 'dashboardContent', content: dashboardContentJson }, event.origin);
          } catch (error) {
            parent.postMessage({ type: 'dashboardContentError', error: error }, event.origin);
          }
          break;
        case 'navigate':
          const query = event.data.query;
          if (query) {
            locationService.partial(query, true);
          }
          break;
        case 'theme':
          const theme = event.data.theme;
          if (theme) {
            changeTheme(theme);
          }
          break;
        case 'explore':
          // investigate explore more with kiosk mode
          const path = event.data.path;
          if (path) {
            locationService.replace(path);
          }
        default:
          console.warn('Unknown message type:', event.data.type);
      }
    }
  }

  private async getDashboardContent() {
    const dashboard = getDashboardSrv().getCurrent() as unknown as DashboardModelCompatibilityWrapper;
    const dashboard2 = getDashboardSceneSerializer().getSaveModel(dashboard.scene);
    if (dashboard2) {
      console.log("dashboard2", dashboard2);
      return dashboard2;
    }
    throw new Error('No dashboard is currently being edited');
  }
}
