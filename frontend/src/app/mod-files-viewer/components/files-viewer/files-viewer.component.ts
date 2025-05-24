import { Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';

import { INode } from '../../../mod-files-data/models/inode';
import { INodeService, WopiService } from '../../../mod-files/mod-files.module';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TitlebarService } from '../../../mod-commons/mod-commons.module';

@Component({
  selector: 'app-files-viewer',
  templateUrl: './files-viewer.component.html',
  styleUrls: ['./files-viewer.component.css'],
  standalone: false
})
export class FilesViewerComponent {

  inode: INode = INode.empty();
  viewType: string = '';
  possibleViewers: string[] = new Array<string>();

  @Output()
  close: EventEmitter<void> = new EventEmitter<void>();

  private destroyRef = inject(DestroyRef);
  private patternsToAliases: Map<RegExp, string[]> = new Map<RegExp, string[]>();

  private static quillTypes = [
    /text\/.*/g,
    /application\/json/g,
    /application\/javascript/g,
  ]

  /**
   * 
   * @param inodeSvc 
   * @param contentTypeSvc 
   * @param dialogRef 
   * @param data 
   */
  constructor(
    private route: ActivatedRoute,
    private inodeSvc: INodeService,
    private titleBarSvc: TitlebarService,
    private wopiSvc: WopiService) {
  }

  /**
   * 
   */
  ngOnInit(): void {

    // UUID aus der Route lesen und inode laden
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {

        const uuid = params.get('uuid') || '';
        console.log(`show viewer for uuid ${uuid}`);

        // INode laden
        this.inodeSvc.getINode(uuid)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(inode => {

            console.log(`inode loaded: ${JSON.stringify(inode)}`);
            this.inode = inode;
            this.titleBarSvc.subTitle = inode.name;

            console.log('load mimetypes');
            this.loadMimetypes(inode);
          })
      })
  }

  /**
   * 
   */
  public get srcUrl(): string {
    return this.inodeSvc.getContentUrl(this.inode.uuid);
  }

  /**
   * 
   */
  private loadMimetypes(inode: INode) {

    this.wopiSvc.getWOPIMimeTypes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(wopiTypes => {

        this.compileRegExps(wopiTypes, 'collabara');
        this.injectTypes(FilesViewerComponent.quillTypes, 'quill');
        this.injectSingleType(/image\/.*/g, 'image');
        this.injectSingleType(/video\/.*/g, 'video');
        this.injectSingleType(/audio\/.*/g, 'sound');
        this.possibleViewers = this.getPossibleViewers(inode);
        this.viewType = this.detectType();

      })
  }

  /**
   * 
   * @returns 
   */
  public detectType(): string {

    let result = '';
    switch (this.possibleViewers.length) {
      case 0:
        break;

      case 1:
        result = this.possibleViewers[0];
        break;

      default:
        result = 'chooser';
        break;
    }
    return result;
  }

  /**
   * 
   * @param inode 
   * @returns 
   */
  private getPossibleViewers(inode: INode): string[] {

    const result: Set<string> = new Set<string>();

    this.patternsToAliases.forEach((aliases: string[], regexp: RegExp) => {

      if (regexp.test(inode.type)) {
        aliases.forEach(alias => {
          result.add(alias);
        })
      }
    })

    return Array.from(result);
  }

  /**
   * 
   * @param types 
   * @param alias 
   * @returns 
   */
  private compileRegExps(types: string[], alias: string) {

    const exps = types.map(pattern => {
      const masked = pattern.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      return new RegExp(masked, 'g');
    });
    this.injectTypes(exps, alias);
  }

  /**
   * 
   * @param regex 
   * @param alias 
   */
  private injectTypes(regex: RegExp[], alias: string) {

    regex.forEach(exp => {
      this.injectSingleType(exp, alias);
    });
  }

  /**
   * 
   * @param regex 
   * @param alias 
   */
  private injectSingleType(regex: RegExp, alias: string) {
    const aliases = this.patternsToAliases.get(regex) || new Array<string>();
    aliases.push(alias);
    this.patternsToAliases.set(regex, aliases);
  }

}
