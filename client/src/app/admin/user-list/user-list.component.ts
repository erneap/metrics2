import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/models/interfaces';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  private _users: User[] = [];
  @Input() 
  get users(): User[] { return this._users; }
  set users(users: User[] ) {
    this._users = users.sort((a,b) => a.compareTo(b));
  }

  @Output() userSelected = new EventEmitter<User>();

  onSelectUser(user: User | undefined) {
    if (!user) {
      user = new User();
    }
    this.userSelected.emit(user);
  }
}
