import { GraphQLSchema, Location } from 'graphql';
import {
  ContextToken,
  Diagnostic,
  DIAGNOSTIC_SEVERITY,
  getHoverInformation,
  getRange,
  IPosition as GraphQLPosition,
  IRange as GraphQLRange,
  Position,
} from 'graphql-language-service';
import * as monaco from 'monaco-editor';
import { MarkerSeverity } from 'monaco-editor';
import { EnrichedLanguageService } from './enriched-language-service';

export { getRange };

export function removeFalsey<T>(obj: T | null): obj is T {
  return !!obj;
}

export function locToRange(loc: Location): monaco.IRange {
  return {
    startLineNumber: loc.startToken.line,
    startColumn: loc.startToken.column,
    endLineNumber: loc.endToken.line + 1, // Because GraphQL starts with 0, and Monaco starts with 1
    endColumn: loc.endToken.column,
  };
}

export const emptyLocation: monaco.IRange = {
  startLineNumber: 0,
  startColumn: 0,
  endLineNumber: 0,
  endColumn: 0,
};

export type BridgeOptions = {
  schema: GraphQLSchema;
  document: string;
  position: GraphQLPosition;
  model: monaco.editor.ITextModel;
  token: ContextToken;
  languageService: EnrichedLanguageService;
};

export type HoverSource = {
  forNode(
    options: BridgeOptions,
  ): monaco.IMarkdownString | null | Promise<monaco.IMarkdownString | null>;
};

export type DiagnosticsSource = {
  forDocument(
    options: Pick<BridgeOptions, 'document' | 'languageService' | 'model'>,
  ): monaco.editor.IMarkerData[] | null | Promise<monaco.editor.IMarkerData[] | null>;
};

export const coreDiagnosticsSource: DiagnosticsSource = {
  async forDocument({ model, document, languageService }) {
    return languageService
      .getDiagnostics(model.uri.toString(), document)
      .then(diag => diag.map(toMarkerData))
      .catch(e => {
        if ('message' in e && 'locations' in e) {
          return [
            toMarkerData({
              severity: DIAGNOSTIC_SEVERITY.Error,
              message: e.message,
              source: 'GraphQL: Syntax',
              range: getRange(e.locations[0], document),
            }),
          ];
        }
        // eslint-disable-next-line no-console -- show error
        console.warn('GraphQL getDiagnostics failed unexpected error:', e);

        return [];
      });
  },
};

export type DecorationsSource = {
  forDocument(
    options: Pick<BridgeOptions, 'document' | 'languageService' | 'model'> & {
      editor: monaco.editor.IStandaloneCodeEditor | monaco.editor.IStandaloneDiffEditor;
      monaco: typeof monaco;
    },
  ): void | Promise<void>;
};

export type DefinitionSource = {
  forNode(
    options: BridgeOptions,
  ): monaco.languages.Definition[] | null | Promise<monaco.languages.Definition[] | null>;
};

export const coreDefinitionSource: DefinitionSource = {
  forNode({ schema, model, token }) {
    if (token.state?.name && token.state.kind === 'NamedType') {
      const type = schema.getType(token.state.name);

      if (type?.astNode?.loc) {
        return [
          {
            range: {
              startLineNumber: type.astNode.loc.startToken.line,
              startColumn: type.astNode.loc.startToken.column,
              endLineNumber: type.astNode.loc.endToken.line + 1,
              endColumn: type.astNode.loc.endToken.column,
            },
            uri: model.uri,
          },
        ];
      }
    }

    return [];
  },
};

export const coreHoverSource: HoverSource = {
  forNode: ({ schema, document, position, token }) => ({
    value: getHoverInformation(schema, document, position, token) as string,
  }),
};

export const debugHoverSource: HoverSource = {
  forNode: ({ token }) => ({
    value: `\`\`\`json\n${JSON.stringify(token.state, null, 2)}\n\`\`\``,
  }),
};

export function toGraphQLPosition(position: monaco.Position): GraphQLPosition {
  return new Position(position.lineNumber - 1, position.column - 1);
}

const DiagnosticSeverityToMarkerSeverity = {
  1: MarkerSeverity.Error,
  2: MarkerSeverity.Warning,
  3: MarkerSeverity.Info,
  4: MarkerSeverity.Hint,
};

export function toMarkerData(diagnostic: Diagnostic): monaco.editor.IMarkerData {
  return {
    startLineNumber: diagnostic.range.start.line + 1,
    endLineNumber: diagnostic.range.end.line + 1,
    startColumn: diagnostic.range.start.character + 1,
    endColumn: diagnostic.range.end.character,
    message: diagnostic.message,
    severity: diagnostic.severity
      ? DiagnosticSeverityToMarkerSeverity[diagnostic.severity]
      : MarkerSeverity.Info,
    code: (diagnostic.code as string) || undefined,
  };
}

export function toMonacoRange(range: GraphQLRange): monaco.IRange {
  return {
    startLineNumber: range.start.line + 1,
    startColumn: range.start.character + 1,
    endLineNumber: range.end.line + 1,
    endColumn: range.end.character + 1,
  };
}

export type EditorAction = {
  id: string;
  label: string;
  keybindings?: number[];
  contextMenuGroupId?: string;
  contextMenuOrder?: number;
  onRun: (options: {
    editor: monaco.editor.IStandaloneCodeEditor | monaco.editor.IStandaloneDiffEditor;
    monaco: typeof monaco;
    bridge: BridgeOptions;
  }) => void;
};

export function showWidgetInPosition(
  editorInstance: monaco.editor.IStandaloneCodeEditor,
  position: BridgeOptions['position'],
  htmlElement: HTMLElement,
): void {
  editorInstance.changeViewZones(changeAccessor => {
    changeAccessor.addZone({
      afterLineNumber: position.line + 1,
      heightInPx: 60,
      domNode: htmlElement,
    });
  });
}
