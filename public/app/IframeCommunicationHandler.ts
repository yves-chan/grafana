import { locationService } from '@grafana/runtime';
import { getDashboardSrv } from 'app/features/dashboard/services/DashboardSrv';

import { changeTheme } from './core/services/theme';
import { DashboardModelCompatibilityWrapper } from './features/dashboard-scene/utils/DashboardModelCompatibilityWrapper';
import { changeLanguage } from './core/internationalization';

export class IframeCommunicationHandler {
  private messageListener: (event: MessageEvent) => void;
  // private locationSubscription: Observable<Location>;


  constructor() {
    // Define the message listener
    this.messageListener = this.handleMessage.bind(this);

    // Let iframe container know grafana has started loading
    parent.postMessage('IframeMounted', '*');

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
        case 'saveDashboard':
          this.saveDashboard(event.origin);
          break;
        case 'navigate':
          console.log('navigate', event.data);
          const { path, params } = event.data;
          if (path) {
            locationService.replace(path);
          } else if (params) {
            locationService.partial(params, true);
          }
          break;
        case 'theme':
          const theme = event.data.theme;
          console.log('theme', theme);
          if (theme) {
            changeTheme(theme);
          }
          break;
        case 'changeLanguage':
          const language = event.data.language;
          console.log('language', language);
          if (language) {
            changeLanguage(language);
          }
          break;
        default:
          console.warn('Unknown message type:', event.data.type);
      }
    }
  }

  private async saveDashboard(targetOrigin: string) {
    // if the current dashboard is a scene, the getCurrent method will return a DashboardModelCompatibilityWrapper
    const dashboardWrapper = getDashboardSrv().getCurrent() as unknown as DashboardModelCompatibilityWrapper;
    const onSaveSuccess = () => {
      parent.postMessage({ type: 'dashboardSave', content: 'success' }, targetOrigin);
    };
    dashboardWrapper.scene.openSaveDrawer({ saveAsCopy: false, onSaveSuccess });
  }
}
