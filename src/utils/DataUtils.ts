import { TaskStatus } from "../enums/TaskStatus";

export class DataUtils {

static createGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  static MapTaskStatusEnum(task: string) : TaskStatus | undefined
  {
    switch (task) {
        case 'DONE':
           return TaskStatus.DONE
          break;
        case 'IN_PROGRESS':
            return TaskStatus.IN_PROGRESS
        case 'TODO':
            return TaskStatus.TODO
          break;
        default:
            return undefined
      }
  }

  static MapTaskStatusEnumToText(task: number) : string | undefined
  {
    switch (task) {
        case 0:
           return 'TODO'
          break;
        case 1:
            return 'IN_PROGRESS'
        case 2:
            return "DONE"
          break;
        default:
            return undefined
      }
  }
}
