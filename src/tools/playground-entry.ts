/*
Copyright 2026 anonyme-afk

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { parseUniFile } from '../parser/uniParser.js';

// Expose the parser to the global window object for the browser
if (typeof window !== 'undefined') {
  (window as any).UniStackParser = {
    parse: (code: string) => {
      try {
        return parseUniFile(code, 'playground.uni');
      } catch (err) {
        return { error: (err as Error).message };
      }
    }
  };
}
