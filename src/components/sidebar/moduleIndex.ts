import { adminPortal } from './modules/adminPortal';
import { chatPortal } from './modules/chat';
import type { ServerTeam } from './types';
import { workflowPortal } from './modules/workflowPortal';
import { commandCenterPortal } from './modules/command-center';

export const teams: ServerTeam[] = [adminPortal, chatPortal, workflowPortal, commandCenterPortal];
