import { describe, expect, it, injectAsync, TestComponentBuilder } from 'angular2/testing';
import { Home } from './home';


describe('Home', () => {
  it('should have Todos headline', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    return new Promise(resolve => {
      tcb.createAsync(Home)
        .then(fixture => {
          fixture.detectChanges();
          let compiled = fixture.nativeElement;
          expect(compiled.querySelector('h3')).toHaveText('Todos');
          resolve();
        });
    });
  }));
});
