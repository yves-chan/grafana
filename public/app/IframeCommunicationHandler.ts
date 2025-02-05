import { locationService } from '@grafana/runtime';
import { getDashboardSrv } from 'app/features/dashboard/services/DashboardSrv';

import appEvents from './core/app_events';
import { changeLanguage } from './core/internationalization';
import { changeTheme } from './core/services/theme';
import { discardPanelChanges } from './features/dashboard/components/PanelEditor/state/actions';
import { SaveDashboardDrawer } from './features/dashboard/components/SaveDashboard/SaveDashboardDrawer';
import { DashboardModel } from './features/dashboard/state/DashboardModel';
import { DashboardScene } from './features/dashboard-scene/scene/DashboardScene';
import { DashboardModelCompatibilityWrapper } from './features/dashboard-scene/utils/DashboardModelCompatibilityWrapper';
import { ShowModalReactEvent } from './types/events';

export class IframeCommunicationHandler {
  private messageListener: (event: MessageEvent) => void;

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

  getScene() {
    const dashboard = getDashboardSrv().getCurrent();
    console.log("in getScene", dashboard);
    // if the current dashboard is a scene, the getCurrent method will return a DashboardModelCompatibilityWrapper
    if (isDashboardModelCompatibilityWrapper(dashboard)) {
      return dashboard.scene;
    }
    return dashboard as DashboardModel;
  }

  initializeIframe() {
    parent.postMessage('IframeMounted', '*');
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
        case 'discardPanelChanges':
          this.discardPanelChanges(event.origin);
          break;
        case 'navigate':
          console.log('navigate', event.data);
          const { path, params } = event.data;
          if (path) {
            locationService.replace(path);
          } else if (params) {
            locationService.partial(params);
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

  private discardPanelChanges(targetOrigin: string) {
    const dashboard = this.getScene();
    if (dashboard instanceof DashboardScene) {
      dashboard.exitEditMode({ skipConfirm: true, restoreInitialState: true});
    } else {      
      discardPanelChanges();
    }
    parent.postMessage({ type: 'panelChangesDiscarded' }, targetOrigin);
  }

  private saveDashboard(targetOrigin: string, saveAsCopy = false) {
    //TODO: can have another message passed to saveAsCopy

    const onSaveSuccess = () => {
      parent.postMessage({ type: 'dashboardSave', content: 'success' }, targetOrigin);
    };
    const dashboard = this.getScene();
    if (dashboard instanceof DashboardScene) {
      (dashboard as DashboardScene).openSaveDrawer({ saveAsCopy, onSaveSuccess });
    } else {
      appEvents.publish(
        new ShowModalReactEvent({
          component: SaveDashboardDrawer,
          props: { dashboard: dashboard, onSaveSuccess, isCopy: saveAsCopy },
        })
      );
    }
  }
}

function isDashboardModelCompatibilityWrapper(dashboard: any): dashboard is DashboardModelCompatibilityWrapper {
  return dashboard && typeof dashboard === 'object' && 'scene' in dashboard;
}
