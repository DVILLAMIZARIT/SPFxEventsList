import * as React from 'react';
import * as ReactDom from 'react-dom';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  IWebPartContext
} from '@microsoft/sp-webpart-base';
import pnp from 'sp-pnp-js';

import * as strings from 'EventsListWebPartStrings';
import EventsList from './components/EventsList';
import { IEventsListProps } from './components/IEventsListProps';
import { IEventsListWebPartProps } from './IEventsListWebPartProps';

export default class EventsListWebPart extends BaseClientSideWebPart<IEventsListWebPartProps> {
//E:\ReactJS\SPFX\SPFXReact\eventsList\node_modules\bootstrap\dist\css\bootstrap.min.css

  public constructor(context: IWebPartContext) {
    super();

  //    SPComponentLoader.loadCss("https://appsforoffice.microsoft.com/fabric/1.0/fabric.components.min.css")
    
    SPComponentLoader.loadCss("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css");
  }

  public onInit(): Promise<void> {
    
      return super.onInit().then(_ => {
    
        pnp.setup({
          spfxContext: this.context
        });
        
      });
    }

  public render(): void {
    const element: React.ReactElement<IEventsListProps > = React.createElement(
      EventsList,
      {
        list: this.properties.list,
        showMore: this.properties.showMore,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return { 
      pages: [
        {
          header: {
            description: 'WEBPART DE EVENTOS'
          },
          groups: [
            {
              groupName: 'Parámetros',
              groupFields: [
                PropertyPaneTextField('list', {
                  label: 'Lista de Eventos'
                }),
                PropertyPaneSlider('showMore', {
                  label: 'Número mostrar más',
                  min: 0,
                  
                  max: 10
                })

              ]
            },
            
          ]
        }
      ]
    };
  }
}
