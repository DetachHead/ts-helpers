# placeholder

the imports on this package currently don't work with deno. see https://github.com/DetachHead/ts-helpers/pull/129#issue-785332681

for now, just use esm.sh:

```ts
import { exactly } from 'http://esm.sh/@detachhead/ts-helpers/dist/utilityFunctions/misc.ts'
```
