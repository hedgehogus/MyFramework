import { User } from "../models/user";
import { View } from "./View";

export class UserForm extends View<User>{
    
    eventsMap(): { [key: string]: () => void } {
        return {
            //'click:button': this.onButtonClick,
            //'mouseenter:h1': this.onHeaderHover,
            'click:.set-age': this.onSetAgeClick,
            'click:.change-name': this.onSetNameClick
        };
    }

    /*    onButtonClick(): void {
           console.log('Hi there');
       }
   
       onHeaderHover(): void {
           console.log('H1 was hovered over');
       } */

    onSetAgeClick = (): void => {
        this.model.setRandomAge();
    }

    onSetNameClick = (): void => {
        const input = this.parent.querySelector('input');
        if (!input) {
            return;
        }
        const name = input.value;

        this.model.set({ name });
    }


    template(): string {
        return `
            <div>
                <h1>User Form</h1>
                <div>User name: ${this.model.get('name')}</div>
                <div>User age: ${this.model.get('age')}</div>
                <input />
                <button class="change-name">Change name</button>
                <button class="set-age">Set Random Age</button>
            </div>
        `;
    }


}