import { AxiosPromise, AxiosResponse } from "axios";
import { Callback } from "./Eventing";
import { HasId } from "./ApiSync";

interface ModelAttributes<T> {
    set(update: T): void;
    getAll(): T;
    get<K extends keyof T>(key: K): T[K];
}

interface Sync<T> {
    fetch(id: number): AxiosPromise<T>;
    save(data: T): AxiosPromise<T>;
}

interface Events {
    on: (eventName: string, callback: Callback) => void;  
    trigger: (eventName: string) => void; 
    clearEvents: () => void; 
}


export class Model<T extends HasId> {
    constructor(
        private attributes: ModelAttributes<T>,
        private events: Events,
        private sync: Sync<T>
    ) {}

    on = this.events.on;

    trigger = this.events.trigger;

    clearEvents = this.events.clearEvents;

    get = this.attributes.get;

    set(update: T): void {
        this.attributes.set(update);
        this.events.trigger('change');
    }

    fetch(): void {
        const id = this.attributes.get('id');

        if (typeof id !== 'number') {
            throw new Error('Cannot fetch without an id');
        }

        this.sync.fetch(id).then((response: AxiosResponse): void => {
            this.set(response.data);
        });
    }

    save(): void {
        this.sync.save(this.attributes.getAll()).then((response: AxiosResponse): void => {
            this.trigger('save');
        }).catch(() => {
            this.trigger('error');
        });
    }
}