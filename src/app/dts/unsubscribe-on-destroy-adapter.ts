import {Component, Directive, OnDestroy} from '@angular/core';
import {SubSink} from 'subsink';
import {Subject} from 'rxjs';

/**
 * A class that automatically unsubscribes all observables when the object gets destroyed
 */
@Component({template: ''})
export class UnsubscribeOnDestroyAdapter implements OnDestroy {
  /** The subscription sink object that stores all subscriptions */
  protected subs = new SubSink();
  /** Subject that emits a value on destroy to unsubscribe all subscriptions that use a "takeUntil" approach */
  protected destroy = new Subject();

  /**
   * The lifecycle hook that unsubscribes all subscriptions when the component / object gets destroyed
   */
  ngOnDestroy(): void {
    this.destroy.next();
    this.subs.unsubscribe();
  }
}
