import { ComponentRef, ViewRef } from '@angular/core';
import { ContentRef } from './content-ref';

fdescribe('ContentRef', () => {
  const viewRef: jasmine.SpyObj<ViewRef> = jasmine.createSpyObj('viewRef', ['destroy', 'onDestroy']);
  const componentRef: jasmine.SpyObj<ComponentRef<any>> = jasmine.createSpyObj('ComponentRef', ['destroy', 'onDestroy']);

  it('should create an instance', () => {
    expect(new ContentRef([], viewRef, componentRef)).toBeTruthy();
  });
});
