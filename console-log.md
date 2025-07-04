react-dom-client.development.js:25022 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
react-server-dom-turbopack-client.browser.development.js:2654  Server   ⚠ Unsupported metadata viewport is configured in metadata export in /modules. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
react-stack-bottom-frame @ react-server-dom-turbopack-client.browser.development.js:2654
resolveConsoleEntry @ react-server-dom-turbopack-client.browser.development.js:2128
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:2263
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:2226
progress @ react-server-dom-turbopack-client.browser.development.js:2472
<StreamingMetadataOutlet>
buildFakeTask @ react-server-dom-turbopack-client.browser.development.js:2033
initializeFakeTask @ react-server-dom-turbopack-client.browser.development.js:2020
resolveDebugInfo @ react-server-dom-turbopack-client.browser.development.js:2056
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:2254
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:2226
progress @ react-server-dom-turbopack-client.browser.development.js:2472
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:1580
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:2389
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:2702
[project]/node_modules/next/dist/client/app-index.js [app-client] (ecmascript) @ app-index.tsx:157
(anonymous) @ dev-base.ts:201
runModuleExecutionHooks @ dev-base.ts:261
instantiateModule @ dev-base.ts:199
getOrInstantiateModuleFromParent @ dev-base.ts:128
commonJsRequire @ runtime-utils.ts:241
(anonymous) @ app-next-turbopack.ts:11
(anonymous) @ app-bootstrap.ts:78
loadScriptsInSequence @ app-bootstrap.ts:20
appBootstrap @ app-bootstrap.ts:60
[project]/node_modules/next/dist/client/app-next-turbopack.js [app-client] (ecmascript) @ app-next-turbopack.ts:10
(anonymous) @ dev-base.ts:201
runModuleExecutionHooks @ dev-base.ts:261
instantiateModule @ dev-base.ts:199
getOrInstantiateRuntimeModule @ dev-base.ts:97
registerChunk @ runtime-backend-dom.ts:85
await in registerChunk
registerChunk @ runtime-base.ts:356
(anonymous) @ dev-backend-dom.ts:127
(anonymous) @ dev-backend-dom.ts:127
layout.tsx:26 A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <HotReload assetPrefix="" globalError={[...]}>
      <AppDevOverlay state={{nextId:1, ...}} globalError={[...]}>
        <AppDevOverlayErrorBoundary globalError={[...]} onError={function bound dispatchSetState}>
          <ReplaySsrOnlyErrors>
          <DevRootHTTPAccessFallbackBoundary>
            <HTTPAccessFallbackBoundary notFound={<NotAllowedRootHTTPFallbackError>}>
              <HTTPAccessFallbackErrorBoundary pathname="/modules" notFound={<NotAllowedRootHTTPFallbackError>} ...>
                <RedirectBoundary>
                  <RedirectErrorBoundary router={{...}}>
                    <Head>
                    <link>
                    <script>
                    <script>
                    <RootLayout>
                      <html
                        lang="tr"
+                       className="nunito_f3e230c0-module__MBaTDa__variable"
-                       className="nunito_f3e230c0-module__MBaTDa__variable light"
-                       style={{color-scheme:"light"}}
                      >
                    ...
        ...

error @ intercept-console-error.ts:40
(anonymous) @ react-dom-client.development.js:4625
runWithFiberInDEV @ react-dom-client.development.js:844
emitPendingHydrationWarnings @ react-dom-client.development.js:4624
completeWork @ react-dom-client.development.js:11256
runWithFiberInDEV @ react-dom-client.development.js:847
completeUnitOfWork @ react-dom-client.development.js:15393
performUnitOfWork @ react-dom-client.development.js:15274
workLoopConcurrentByScheduler @ react-dom-client.development.js:15251
renderRootConcurrent @ react-dom-client.development.js:15226
performWorkOnRoot @ react-dom-client.development.js:14524
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
<html>
RootLayout @ layout.tsx:26
(anonymous) @ react-server-dom-turbopack-client.browser.development.js:2348
initializeModelChunk @ react-server-dom-turbopack-client.browser.development.js:1047
getOutlinedModel @ react-server-dom-turbopack-client.browser.development.js:1320
parseModelString @ react-server-dom-turbopack-client.browser.development.js:1533
(anonymous) @ react-server-dom-turbopack-client.browser.development.js:2287
initializeModelChunk @ react-server-dom-turbopack-client.browser.development.js:1047
resolveModelChunk @ react-server-dom-turbopack-client.browser.development.js:1024
resolveModel @ react-server-dom-turbopack-client.browser.development.js:1592
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:2281
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:2226
progress @ react-server-dom-turbopack-client.browser.development.js:2472
<RootLayout>
buildFakeTask @ react-server-dom-turbopack-client.browser.development.js:2033
initializeFakeTask @ react-server-dom-turbopack-client.browser.development.js:2020
resolveDebugInfo @ react-server-dom-turbopack-client.browser.development.js:2056
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:2254
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:2226
progress @ react-server-dom-turbopack-client.browser.development.js:2472
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:1580
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:2389
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:2702
[project]/node_modules/next/dist/client/app-index.js [app-client] (ecmascript) @ app-index.tsx:157
(anonymous) @ dev-base.ts:201
runModuleExecutionHooks @ dev-base.ts:261
instantiateModule @ dev-base.ts:199
getOrInstantiateModuleFromParent @ dev-base.ts:128
commonJsRequire @ runtime-utils.ts:241
(anonymous) @ app-next-turbopack.ts:11
(anonymous) @ app-bootstrap.ts:78
loadScriptsInSequence @ app-bootstrap.ts:20
appBootstrap @ app-bootstrap.ts:60
[project]/node_modules/next/dist/client/app-next-turbopack.js [app-client] (ecmascript) @ app-next-turbopack.ts:10
(anonymous) @ dev-base.ts:201
runModuleExecutionHooks @ dev-base.ts:261
instantiateModule @ dev-base.ts:199
getOrInstantiateRuntimeModule @ dev-base.ts:97
registerChunk @ runtime-backend-dom.ts:85
await in registerChunk
registerChunk @ runtime-base.ts:356
(anonymous) @ dev-backend-dom.ts:127
(anonymous) @ dev-backend-dom.ts:127
report-hmr-latency.ts:26 [Fast Refresh] done in NaNms
turbopack-hot-reloader-common.ts:41 [Fast Refresh] rebuilding
report-hmr-latency.ts:26 [Fast Refresh] done in 808ms
page.tsx:66  Server   ⚠ Unsupported metadata viewport is configured in metadata export in /exercise/vocabulary. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
react-stack-bottom-frame @ react-server-dom-turbopack-client.browser.development.js:2654
resolveConsoleEntry @ react-server-dom-turbopack-client.browser.development.js:2128
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:2263
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:2226
progress @ react-server-dom-turbopack-client.browser.development.js:2472
<StreamingMetadataOutlet>
buildFakeTask @ react-server-dom-turbopack-client.browser.development.js:2033
initializeFakeTask @ react-server-dom-turbopack-client.browser.development.js:2020
resolveDebugInfo @ react-server-dom-turbopack-client.browser.development.js:2056
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:2254
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:2226
progress @ react-server-dom-turbopack-client.browser.development.js:2472
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:1580
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:2389
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:2702
createFromNextReadableStream @ fetch-server-response.ts:301
fetchServerResponse @ fetch-server-response.ts:230
await in fetchServerResponse
(anonymous) @ prefetch-cache-utils.ts:323
task @ promise-queue.ts:33
processNext @ promise-queue.ts:66
enqueue @ promise-queue.ts:46
createLazyPrefetchEntry @ prefetch-cache-utils.ts:322
getOrCreatePrefetchCacheEntry @ prefetch-cache-utils.ts:227
navigateReducer @ navigate-reducer.ts:216
clientReducer @ router-reducer.ts:32
action @ app-router-instance.ts:211
runAction @ app-router-instance.ts:98
dispatchAction @ app-router-instance.ts:163
dispatch @ app-router-instance.ts:209
(anonymous) @ use-action-queue.ts:46
startTransition @ react-dom-client.development.js:7842
dispatch @ use-action-queue.ts:45
dispatchAppRouterAction @ use-action-queue.ts:22
dispatchNavigateAction @ app-router-instance.ts:280
(anonymous) @ app-router-instance.ts:352
exports.startTransition @ react.development.js:1127
push @ app-router-instance.ts:351
handleModuleClick @ page.tsx:66
onClick @ page.tsx:130
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
<div>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
ModuleCard @ ModuleCard.tsx:22
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopConcurrentByScheduler @ react-dom-client.development.js:15251
renderRootConcurrent @ react-dom-client.development.js:15226
performWorkOnRoot @ react-dom-client.development.js:14524
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
<ModuleCard>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
(anonymous) @ page.tsx:125
ModulesPage @ page.tsx:117
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopConcurrentByScheduler @ react-dom-client.development.js:15251
renderRootConcurrent @ react-dom-client.development.js:15226
performWorkOnRoot @ react-dom-client.development.js:14524
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
<ModulesPage>
exports.jsx @ react-jsx-runtime.development.js:339
ClientPageRoot @ client-page.tsx:60
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10504
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopConcurrentByScheduler @ react-dom-client.development.js:15251
renderRootConcurrent @ react-dom-client.development.js:15226
performWorkOnRoot @ react-dom-client.development.js:14524
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
"use client"
(anonymous) @ react-server-dom-turbopack-client.browser.development.js:2347
initializeModelChunk @ react-server-dom-turbopack-client.browser.development.js:1047
resolveModelChunk @ react-server-dom-turbopack-client.browser.development.js:1024
resolveModel @ react-server-dom-turbopack-client.browser.development.js:1592
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:2281
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:2226
progress @ react-server-dom-turbopack-client.browser.development.js:2472
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:1580
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:2389
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:2702
[project]/node_modules/next/dist/client/app-index.js [app-client] (ecmascript) @ app-index.tsx:157
(anonymous) @ dev-base.ts:201
runModuleExecutionHooks @ dev-base.ts:261
instantiateModule @ dev-base.ts:199
getOrInstantiateModuleFromParent @ dev-base.ts:128
commonJsRequire @ runtime-utils.ts:241
(anonymous) @ app-next-turbopack.ts:11
(anonymous) @ app-bootstrap.ts:78
loadScriptsInSequence @ app-bootstrap.ts:20
appBootstrap @ app-bootstrap.ts:60
[project]/node_modules/next/dist/client/app-next-turbopack.js [app-client] (ecmascript) @ app-next-turbopack.ts:10
(anonymous) @ dev-base.ts:201
runModuleExecutionHooks @ dev-base.ts:261
instantiateModule @ dev-base.ts:199
getOrInstantiateRuntimeModule @ dev-base.ts:97
registerChunk @ runtime-backend-dom.ts:85
await in registerChunk
registerChunk @ runtime-base.ts:356
(anonymous) @ dev-backend-dom.ts:127
(anonymous) @ dev-backend-dom.ts:127
page.tsx:66  Server   ⚠ Unsupported metadata viewport is configured in metadata export in /exercise/vocabulary. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
react-stack-bottom-frame @ react-server-dom-turbopack-client.browser.development.js:2654
resolveConsoleEntry @ react-server-dom-turbopack-client.browser.development.js:2128
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:2263
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:2226
progress @ react-server-dom-turbopack-client.browser.development.js:2472
<StreamingMetadataOutlet>
buildFakeTask @ react-server-dom-turbopack-client.browser.development.js:2033
initializeFakeTask @ react-server-dom-turbopack-client.browser.development.js:2020
resolveDebugInfo @ react-server-dom-turbopack-client.browser.development.js:2056
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:2254
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:2226
progress @ react-server-dom-turbopack-client.browser.development.js:2472
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:1580
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:2389
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:2702
createFromNextReadableStream @ fetch-server-response.ts:301
fetchServerResponse @ fetch-server-response.ts:230
await in fetchServerResponse
(anonymous) @ prefetch-cache-utils.ts:323
task @ promise-queue.ts:33
processNext @ promise-queue.ts:66
enqueue @ promise-queue.ts:46
createLazyPrefetchEntry @ prefetch-cache-utils.ts:322
getOrCreatePrefetchCacheEntry @ prefetch-cache-utils.ts:227
navigateReducer @ navigate-reducer.ts:216
clientReducer @ router-reducer.ts:32
action @ app-router-instance.ts:211
runAction @ app-router-instance.ts:98
dispatchAction @ app-router-instance.ts:185
dispatch @ app-router-instance.ts:209
(anonymous) @ use-action-queue.ts:46
startTransition @ react-dom-client.development.js:7842
dispatch @ use-action-queue.ts:45
dispatchAppRouterAction @ use-action-queue.ts:22
dispatchNavigateAction @ app-router-instance.ts:280
(anonymous) @ app-router-instance.ts:352
exports.startTransition @ react.development.js:1127
push @ app-router-instance.ts:351
handleModuleClick @ page.tsx:66
onClick @ page.tsx:130
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
<button>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
Button @ Button.tsx:39
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopConcurrentByScheduler @ react-dom-client.development.js:15251
renderRootConcurrent @ react-dom-client.development.js:15226
performWorkOnRoot @ react-dom-client.development.js:14524
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
<Button>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
ModuleCard @ ModuleCard.tsx:53
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopConcurrentByScheduler @ react-dom-client.development.js:15251
renderRootConcurrent @ react-dom-client.development.js:15226
performWorkOnRoot @ react-dom-client.development.js:14524
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
<ModuleCard>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
(anonymous) @ page.tsx:125
ModulesPage @ page.tsx:117
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopConcurrentByScheduler @ react-dom-client.development.js:15251
renderRootConcurrent @ react-dom-client.development.js:15226
performWorkOnRoot @ react-dom-client.development.js:14524
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
<ModulesPage>
exports.jsx @ react-jsx-runtime.development.js:339
ClientPageRoot @ client-page.tsx:60
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10504
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopConcurrentByScheduler @ react-dom-client.development.js:15251
renderRootConcurrent @ react-dom-client.development.js:15226
performWorkOnRoot @ react-dom-client.development.js:14524
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
"use client"
(anonymous) @ react-server-dom-turbopack-client.browser.development.js:2347
initializeModelChunk @ react-server-dom-turbopack-client.browser.development.js:1047
resolveModelChunk @ react-server-dom-turbopack-client.browser.development.js:1024
resolveModel @ react-server-dom-turbopack-client.browser.development.js:1592
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:2281
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:2226
progress @ react-server-dom-turbopack-client.browser.development.js:2472
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:1580
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:2389
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:2702
[project]/node_modules/next/dist/client/app-index.js [app-client] (ecmascript) @ app-index.tsx:157
(anonymous) @ dev-base.ts:201
runModuleExecutionHooks @ dev-base.ts:261
instantiateModule @ dev-base.ts:199
getOrInstantiateModuleFromParent @ dev-base.ts:128
commonJsRequire @ runtime-utils.ts:241
(anonymous) @ app-next-turbopack.ts:11
(anonymous) @ app-bootstrap.ts:78
loadScriptsInSequence @ app-bootstrap.ts:20
appBootstrap @ app-bootstrap.ts:60
[project]/node_modules/next/dist/client/app-next-turbopack.js [app-client] (ecmascript) @ app-next-turbopack.ts:10
(anonymous) @ dev-base.ts:201
runModuleExecutionHooks @ dev-base.ts:261
instantiateModule @ dev-base.ts:199
getOrInstantiateRuntimeModule @ dev-base.ts:97
registerChunk @ runtime-backend-dom.ts:85
await in registerChunk
registerChunk @ runtime-base.ts:356
(anonymous) @ dev-backend-dom.ts:127
(anonymous) @ dev-backend-dom.ts:127
turbopack-hot-reloader-common.ts:41 [Fast Refresh] rebuilding
report-hmr-latency.ts:26 [Fast Refresh] done in 110ms
page.tsx:66  Server   ⚠ Unsupported metadata viewport is configured in metadata export in /exercise/vocabulary. Please move it to viewport export instead.
Read more: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
react-stack-bottom-frame @ react-server-dom-turbopack-client.browser.development.js:2654
resolveConsoleEntry @ react-server-dom-turbopack-client.browser.development.js:2128
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:2263
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:2226
progress @ react-server-dom-turbopack-client.browser.development.js:2472
<StreamingMetadataOutlet>
buildFakeTask @ react-server-dom-turbopack-client.browser.development.js:2033
initializeFakeTask @ react-server-dom-turbopack-client.browser.development.js:2020
resolveDebugInfo @ react-server-dom-turbopack-client.browser.development.js:2056
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:2254
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:2226
progress @ react-server-dom-turbopack-client.browser.development.js:2472
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:1580
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:2389
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:2702
createFromNextReadableStream @ fetch-server-response.ts:301
fetchServerResponse @ fetch-server-response.ts:230
await in fetchServerResponse
(anonymous) @ prefetch-cache-utils.ts:323
task @ promise-queue.ts:33
processNext @ promise-queue.ts:66
enqueue @ promise-queue.ts:46
createLazyPrefetchEntry @ prefetch-cache-utils.ts:322
getOrCreatePrefetchCacheEntry @ prefetch-cache-utils.ts:227
navigateReducer @ navigate-reducer.ts:216
clientReducer @ router-reducer.ts:32
action @ app-router-instance.ts:211
runAction @ app-router-instance.ts:98
dispatchAction @ app-router-instance.ts:185
dispatch @ app-router-instance.ts:209
(anonymous) @ use-action-queue.ts:46
startTransition @ react-dom-client.development.js:7842
dispatch @ use-action-queue.ts:45
dispatchAppRouterAction @ use-action-queue.ts:22
dispatchNavigateAction @ app-router-instance.ts:280
(anonymous) @ app-router-instance.ts:352
exports.startTransition @ react.development.js:1127
push @ app-router-instance.ts:351
handleModuleClick @ page.tsx:66
onClick @ page.tsx:130
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
<div>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
ModuleCard @ ModuleCard.tsx:22
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopConcurrentByScheduler @ react-dom-client.development.js:15251
renderRootConcurrent @ react-dom-client.development.js:15226
performWorkOnRoot @ react-dom-client.development.js:14524
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
<ModuleCard>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
(anonymous) @ page.tsx:125
ModulesPage @ page.tsx:117
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopConcurrentByScheduler @ react-dom-client.development.js:15251
renderRootConcurrent @ react-dom-client.development.js:15226
performWorkOnRoot @ react-dom-client.development.js:14524
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
<ModulesPage>
exports.jsx @ react-jsx-runtime.development.js:339
ClientPageRoot @ client-page.tsx:60
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10504
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopConcurrentByScheduler @ react-dom-client.development.js:15251
renderRootConcurrent @ react-dom-client.development.js:15226
performWorkOnRoot @ react-dom-client.development.js:14524
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
"use client"
(anonymous) @ react-server-dom-turbopack-client.browser.development.js:2347
initializeModelChunk @ react-server-dom-turbopack-client.browser.development.js:1047
resolveModelChunk @ react-server-dom-turbopack-client.browser.development.js:1024
resolveModel @ react-server-dom-turbopack-client.browser.development.js:1592
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:2281
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:2226
progress @ react-server-dom-turbopack-client.browser.development.js:2472
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:1580
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:2389
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:2702
[project]/node_modules/next/dist/client/app-index.js [app-client] (ecmascript) @ app-index.tsx:157
(anonymous) @ dev-base.ts:201
runModuleExecutionHooks @ dev-base.ts:261
instantiateModule @ dev-base.ts:199
getOrInstantiateModuleFromParent @ dev-base.ts:128
commonJsRequire @ runtime-utils.ts:241
(anonymous) @ app-next-turbopack.ts:11
(anonymous) @ app-bootstrap.ts:78
loadScriptsInSequence @ app-bootstrap.ts:20
appBootstrap @ app-bootstrap.ts:60
[project]/node_modules/next/dist/client/app-next-turbopack.js [app-client] (ecmascript) @ app-next-turbopack.ts:10
(anonymous) @ dev-base.ts:201
runModuleExecutionHooks @ dev-base.ts:261
instantiateModule @ dev-base.ts:199
getOrInstantiateRuntimeModule @ dev-base.ts:97
registerChunk @ runtime-backend-dom.ts:85
await in registerChunk
registerChunk @ runtime-base.ts:356
(anonymous) @ dev-backend-dom.ts:127
(anonymous) @ dev-backend-dom.ts:127
turbopack-hot-reloader-common.ts:41 [Fast Refresh] rebuilding
report-hmr-latency.ts:26 [Fast Refresh] done in 972ms
turbopack-hot-reloader-common.ts:41 [Fast Refresh] rebuilding
elevenlabs.ts:45  POST https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB 401 (Unauthorized)
textToSpeech @ elevenlabs.ts:45
speak @ elevenlabs.ts:180
handleAnswerClick @ KelimeEsleştirmeOyunu.tsx:83
onClick @ KelimeEsleştirmeOyunu.tsx:117
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
<div>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
(anonymous) @ KelimeEsleştirmeOyunu.tsx:115
KelimeEsleştirmeOyunu @ KelimeEsleştirmeOyunu.tsx:114
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopSync @ react-dom-client.development.js:15077
renderRootSync @ react-dom-client.development.js:15057
performWorkOnRoot @ react-dom-client.development.js:14525
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
<KelimeEsleştirmeOyunu>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
VocabularyPage @ page.tsx:73
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopSync @ react-dom-client.development.js:15077
renderRootSync @ react-dom-client.development.js:15057
performWorkOnRoot @ react-dom-client.development.js:14525
performSyncWorkOnRoot @ react-dom-client.development.js:16364
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:16210
processRootScheduleInMicrotask @ react-dom-client.development.js:16249
(anonymous) @ react-dom-client.development.js:16383
<VocabularyPage>
exports.jsx @ react-jsx-runtime.development.js:339
ClientPageRoot @ client-page.tsx:60
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10504
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopConcurrentByScheduler @ react-dom-client.development.js:15251
renderRootConcurrent @ react-dom-client.development.js:15226
performWorkOnRoot @ react-dom-client.development.js:14524
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
"use client"
(anonymous) @ react-server-dom-turbopack-client.browser.development.js:2347
initializeModelChunk @ react-server-dom-turbopack-client.browser.development.js:1047
resolveModelChunk @ react-server-dom-turbopack-client.browser.development.js:1024
resolveModel @ react-server-dom-turbopack-client.browser.development.js:1592
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:2281
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:2226
progress @ react-server-dom-turbopack-client.browser.development.js:2472
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:1580
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:2389
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:2702
createFromNextReadableStream @ fetch-server-response.ts:301
fetchServerResponse @ fetch-server-response.ts:230
await in fetchServerResponse
(anonymous) @ prefetch-cache-utils.ts:323
task @ promise-queue.ts:33
processNext @ promise-queue.ts:66
enqueue @ promise-queue.ts:46
createLazyPrefetchEntry @ prefetch-cache-utils.ts:322
getOrCreatePrefetchCacheEntry @ prefetch-cache-utils.ts:227
navigateReducer @ navigate-reducer.ts:216
clientReducer @ router-reducer.ts:32
action @ app-router-instance.ts:211
runAction @ app-router-instance.ts:98
dispatchAction @ app-router-instance.ts:185
dispatch @ app-router-instance.ts:209
(anonymous) @ use-action-queue.ts:46
startTransition @ react-dom-client.development.js:7842
dispatch @ use-action-queue.ts:45
dispatchAppRouterAction @ use-action-queue.ts:22
dispatchNavigateAction @ app-router-instance.ts:280
(anonymous) @ app-router-instance.ts:352
exports.startTransition @ react.development.js:1127
push @ app-router-instance.ts:351
handleModuleClick @ page.tsx:66
onClick @ page.tsx:130
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
elevenlabs.ts:73 ElevenLabs TTS Error: ElevenLabsAPIError: ElevenLabs API error: 401
    at ElevenLabsClient.textToSpeech (elevenlabs.ts:66:15)
    at async speak (elevenlabs.ts:180:18)
error @ intercept-console-error.ts:40
textToSpeech @ elevenlabs.ts:73
await in textToSpeech
speak @ elevenlabs.ts:180
handleAnswerClick @ KelimeEsleştirmeOyunu.tsx:83
onClick @ KelimeEsleştirmeOyunu.tsx:117
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
<div>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
(anonymous) @ KelimeEsleştirmeOyunu.tsx:115
KelimeEsleştirmeOyunu @ KelimeEsleştirmeOyunu.tsx:114
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopSync @ react-dom-client.development.js:15077
renderRootSync @ react-dom-client.development.js:15057
performWorkOnRoot @ react-dom-client.development.js:14525
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
<KelimeEsleştirmeOyunu>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
VocabularyPage @ page.tsx:73
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopSync @ react-dom-client.development.js:15077
renderRootSync @ react-dom-client.development.js:15057
performWorkOnRoot @ react-dom-client.development.js:14525
performSyncWorkOnRoot @ react-dom-client.development.js:16364
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:16210
processRootScheduleInMicrotask @ react-dom-client.development.js:16249
(anonymous) @ react-dom-client.development.js:16383
<VocabularyPage>
exports.jsx @ react-jsx-runtime.development.js:339
ClientPageRoot @ client-page.tsx:60
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10504
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopConcurrentByScheduler @ react-dom-client.development.js:15251
renderRootConcurrent @ react-dom-client.development.js:15226
performWorkOnRoot @ react-dom-client.development.js:14524
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
"use client"
(anonymous) @ react-server-dom-turbopack-client.browser.development.js:2347
initializeModelChunk @ react-server-dom-turbopack-client.browser.development.js:1047
resolveModelChunk @ react-server-dom-turbopack-client.browser.development.js:1024
resolveModel @ react-server-dom-turbopack-client.browser.development.js:1592
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:2281
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:2226
progress @ react-server-dom-turbopack-client.browser.development.js:2472
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:1580
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:2389
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:2702
createFromNextReadableStream @ fetch-server-response.ts:301
fetchServerResponse @ fetch-server-response.ts:230
await in fetchServerResponse
(anonymous) @ prefetch-cache-utils.ts:323
task @ promise-queue.ts:33
processNext @ promise-queue.ts:66
enqueue @ promise-queue.ts:46
createLazyPrefetchEntry @ prefetch-cache-utils.ts:322
getOrCreatePrefetchCacheEntry @ prefetch-cache-utils.ts:227
navigateReducer @ navigate-reducer.ts:216
clientReducer @ router-reducer.ts:32
action @ app-router-instance.ts:211
runAction @ app-router-instance.ts:98
dispatchAction @ app-router-instance.ts:185
dispatch @ app-router-instance.ts:209
(anonymous) @ use-action-queue.ts:46
startTransition @ react-dom-client.development.js:7842
dispatch @ use-action-queue.ts:45
dispatchAppRouterAction @ use-action-queue.ts:22
dispatchNavigateAction @ app-router-instance.ts:280
(anonymous) @ app-router-instance.ts:352
exports.startTransition @ react.development.js:1127
push @ app-router-instance.ts:351
handleModuleClick @ page.tsx:66
onClick @ page.tsx:130
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
elevenlabs.ts:195 ElevenLabs ses çalma hatası, fallback deneniyor: ElevenLabsAPIError: ElevenLabs API error: 401
    at ElevenLabsClient.textToSpeech (elevenlabs.ts:66:15)
    at async speak (elevenlabs.ts:180:18)
error @ intercept-console-error.ts:40
speak @ elevenlabs.ts:195
await in speak
handleAnswerClick @ KelimeEsleştirmeOyunu.tsx:83
onClick @ KelimeEsleştirmeOyunu.tsx:117
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
<div>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
(anonymous) @ KelimeEsleştirmeOyunu.tsx:115
KelimeEsleştirmeOyunu @ KelimeEsleştirmeOyunu.tsx:114
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopSync @ react-dom-client.development.js:15077
renderRootSync @ react-dom-client.development.js:15057
performWorkOnRoot @ react-dom-client.development.js:14525
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
<KelimeEsleştirmeOyunu>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
VocabularyPage @ page.tsx:73
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopSync @ react-dom-client.development.js:15077
renderRootSync @ react-dom-client.development.js:15057
performWorkOnRoot @ react-dom-client.development.js:14525
performSyncWorkOnRoot @ react-dom-client.development.js:16364
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:16210
processRootScheduleInMicrotask @ react-dom-client.development.js:16249
(anonymous) @ react-dom-client.development.js:16383
<VocabularyPage>
exports.jsx @ react-jsx-runtime.development.js:339
ClientPageRoot @ client-page.tsx:60
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10504
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopConcurrentByScheduler @ react-dom-client.development.js:15251
renderRootConcurrent @ react-dom-client.development.js:15226
performWorkOnRoot @ react-dom-client.development.js:14524
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16349
performWorkUntilDeadline @ scheduler.development.js:45
"use client"
(anonymous) @ react-server-dom-turbopack-client.browser.development.js:2347
initializeModelChunk @ react-server-dom-turbopack-client.browser.development.js:1047
resolveModelChunk @ react-server-dom-turbopack-client.browser.development.js:1024
resolveModel @ react-server-dom-turbopack-client.browser.development.js:1592
processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:2281
processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:2226
progress @ react-server-dom-turbopack-client.browser.development.js:2472
"use server"
ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:1580
createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:2389
exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:2702
createFromNextReadableStream @ fetch-server-response.ts:301
fetchServerResponse @ fetch-server-response.ts:230
await in fetchServerResponse
(anonymous) @ prefetch-cache-utils.ts:323
task @ promise-queue.ts:33
processNext @ promise-queue.ts:66
enqueue @ promise-queue.ts:46
createLazyPrefetchEntry @ prefetch-cache-utils.ts:322
getOrCreatePrefetchCacheEntry @ prefetch-cache-utils.ts:227
navigateReducer @ navigate-reducer.ts:216
clientReducer @ router-reducer.ts:32
action @ app-router-instance.ts:211
runAction @ app-router-instance.ts:98
dispatchAction @ app-router-instance.ts:185
dispatch @ app-router-instance.ts:209
(anonymous) @ use-action-queue.ts:46
startTransition @ react-dom-client.development.js:7842
dispatch @ use-action-queue.ts:45
dispatchAppRouterAction @ use-action-queue.ts:22
dispatchNavigateAction @ app-router-instance.ts:280
(anonymous) @ app-router-instance.ts:352
exports.startTransition @ react.development.js:1127
push @ app-router-instance.ts:351
handleModuleClick @ page.tsx:66
onClick @ page.tsx:130
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
report-hmr-latency.ts:26 [Fast Refresh] done in 973ms
turbopack-hot-reloader-common.ts:41 [Fast Refresh] rebuilding
report-hmr-latency.ts:26 [Fast Refresh] done in 924ms
turbopack-hot-reloader-common.ts:41 [Fast Refresh] rebuilding
elevenlabs.ts:199 Web Speech API ile ses başarıyla çalındı.
report-hmr-latency.ts:26 [Fast Refresh] done in 885ms
turbopack-hot-reloader-common.ts:41 [Fast Refresh] rebuilding
report-hmr-latency.ts:26 [Fast Refresh] done in 483ms
elevenlabs.ts:45  POST https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB 401 (Unauthorized)
textToSpeech @ elevenlabs.ts:45
speak @ elevenlabs.ts:180
handleAnswerClick @ KelimeEsleştirmeOyunu.tsx:83
onClick @ KelimeEsleştirmeOyunu.tsx:117
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
elevenlabs.ts:73 ElevenLabs TTS Error: ElevenLabsAPIError: ElevenLabs API error: 401
    at ElevenLabsClient.textToSpeech (elevenlabs.ts:66:15)
    at async speak (elevenlabs.ts:180:18)
error @ intercept-console-error.ts:40
textToSpeech @ elevenlabs.ts:73
await in textToSpeech
speak @ elevenlabs.ts:180
handleAnswerClick @ KelimeEsleştirmeOyunu.tsx:83
onClick @ KelimeEsleştirmeOyunu.tsx:117
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
elevenlabs.ts:195 ElevenLabs ses çalma hatası, fallback deneniyor: ElevenLabsAPIError: ElevenLabs API error: 401
    at ElevenLabsClient.textToSpeech (elevenlabs.ts:66:15)
    at async speak (elevenlabs.ts:180:18)
error @ intercept-console-error.ts:40
speak @ elevenlabs.ts:195
await in speak
handleAnswerClick @ KelimeEsleştirmeOyunu.tsx:83
onClick @ KelimeEsleştirmeOyunu.tsx:117
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
elevenlabs.ts:199 Web Speech API ile ses başarıyla çalındı.
elevenlabs.ts:45  POST https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB 401 (Unauthorized)
textToSpeech @ elevenlabs.ts:45
speak @ elevenlabs.ts:180
handleAnswerClick @ KelimeEsleştirmeOyunu.tsx:83
onClick @ KelimeEsleştirmeOyunu.tsx:117
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
elevenlabs.ts:73 ElevenLabs TTS Error: ElevenLabsAPIError: ElevenLabs API error: 401
    at ElevenLabsClient.textToSpeech (elevenlabs.ts:66:15)
    at async speak (elevenlabs.ts:180:18)
error @ intercept-console-error.ts:40
textToSpeech @ elevenlabs.ts:73
await in textToSpeech
speak @ elevenlabs.ts:180
handleAnswerClick @ KelimeEsleştirmeOyunu.tsx:83
onClick @ KelimeEsleştirmeOyunu.tsx:117
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
elevenlabs.ts:195 ElevenLabs ses çalma hatası, fallback deneniyor: ElevenLabsAPIError: ElevenLabs API error: 401
    at ElevenLabsClient.textToSpeech (elevenlabs.ts:66:15)
    at async speak (elevenlabs.ts:180:18)
error @ intercept-console-error.ts:40
speak @ elevenlabs.ts:195
await in speak
handleAnswerClick @ KelimeEsleştirmeOyunu.tsx:83
onClick @ KelimeEsleştirmeOyunu.tsx:117
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
elevenlabs.ts:199 Web Speech API ile ses başarıyla çalındı.
elevenlabs.ts:45  POST https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB 401 (Unauthorized)
textToSpeech @ elevenlabs.ts:45
speak @ elevenlabs.ts:180
handleAnswerClick @ KelimeEsleştirmeOyunu.tsx:83
onClick @ KelimeEsleştirmeOyunu.tsx:117
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
elevenlabs.ts:73 ElevenLabs TTS Error: ElevenLabsAPIError: ElevenLabs API error: 401
    at ElevenLabsClient.textToSpeech (elevenlabs.ts:66:15)
    at async speak (elevenlabs.ts:180:18)
error @ intercept-console-error.ts:40
textToSpeech @ elevenlabs.ts:73
await in textToSpeech
speak @ elevenlabs.ts:180
handleAnswerClick @ KelimeEsleştirmeOyunu.tsx:83
onClick @ KelimeEsleştirmeOyunu.tsx:117
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
elevenlabs.ts:195 ElevenLabs ses çalma hatası, fallback deneniyor: ElevenLabsAPIError: ElevenLabs API error: 401
    at ElevenLabsClient.textToSpeech (elevenlabs.ts:66:15)
    at async speak (elevenlabs.ts:180:18)
error @ intercept-console-error.ts:40
speak @ elevenlabs.ts:195
await in speak
handleAnswerClick @ KelimeEsleştirmeOyunu.tsx:83
onClick @ KelimeEsleştirmeOyunu.tsx:117
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
elevenlabs.ts:199 Web Speech API ile ses başarıyla çalındı.
elevenlabs.ts:45  POST https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB 401 (Unauthorized)
textToSpeech @ elevenlabs.ts:45
speak @ elevenlabs.ts:180
handleAnswerClick @ KelimeEsleştirmeOyunu.tsx:83
onClick @ KelimeEsleştirmeOyunu.tsx:117
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
elevenlabs.ts:73 ElevenLabs TTS Error: ElevenLabsAPIError: ElevenLabs API error: 401
    at ElevenLabsClient.textToSpeech (elevenlabs.ts:66:15)
    at async speak (elevenlabs.ts:180:18)
error @ intercept-console-error.ts:40
textToSpeech @ elevenlabs.ts:73
await in textToSpeech
speak @ elevenlabs.ts:180
handleAnswerClick @ KelimeEsleştirmeOyunu.tsx:83
onClick @ KelimeEsleştirmeOyunu.tsx:117
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
elevenlabs.ts:195 ElevenLabs ses çalma hatası, fallback deneniyor: ElevenLabsAPIError: ElevenLabs API error: 401
    at ElevenLabsClient.textToSpeech (elevenlabs.ts:66:15)
    at async speak (elevenlabs.ts:180:18)
error @ intercept-console-error.ts:40
speak @ elevenlabs.ts:195
await in speak
handleAnswerClick @ KelimeEsleştirmeOyunu.tsx:83
onClick @ KelimeEsleştirmeOyunu.tsx:117
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
turbopack-hot-reloader-common.ts:41 [Fast Refresh] rebuilding
report-hmr-latency.ts:26 [Fast Refresh] done in 953ms
elevenlabs.ts:199 Web Speech API ile ses başarıyla çalındı.
turbopack-hot-reloader-common.ts:41 [Fast Refresh] rebuilding
report-hmr-latency.ts:26 [Fast Refresh] done in 987ms
turbopack-hot-reloader-common.ts:41 [Fast Refresh] rebuilding
report-hmr-latency.ts:26 [Fast Refresh] done in 977ms
turbopack-hot-reloader-common.ts:41 [Fast Refresh] rebuilding
elevenlabs.ts:45  POST https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB 401 (Unauthorized)
textToSpeech @ elevenlabs.ts:45
speak @ elevenlabs.ts:180
handleAnswerClick @ KelimeEsleştirmeOyunu.tsx:85
onClick @ KelimeEsleştirmeOyunu.tsx:117
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
<div>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
(anonymous) @ KelimeEsleştirmeOyunu.tsx:115
KelimeEsleştirmeOyunu @ KelimeEsleştirmeOyunu.tsx:114
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopSync @ react-dom-client.development.js:15077
renderRootSync @ react-dom-client.development.js:15057
performWorkOnRoot @ react-dom-client.development.js:14525
performSyncWorkOnRoot @ react-dom-client.development.js:16364
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:16210
processRootScheduleInMicrotask @ react-dom-client.development.js:16249
(anonymous) @ react-dom-client.development.js:16383
elevenlabs.ts:73 ElevenLabs TTS Error: ElevenLabsAPIError: ElevenLabs API error: 401
    at ElevenLabsClient.textToSpeech (elevenlabs.ts:66:15)
    at async speak (elevenlabs.ts:180:18)
error @ intercept-console-error.ts:40
textToSpeech @ elevenlabs.ts:73
await in textToSpeech
speak @ elevenlabs.ts:180
handleAnswerClick @ KelimeEsleştirmeOyunu.tsx:85
onClick @ KelimeEsleştirmeOyunu.tsx:117
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
<div>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
(anonymous) @ KelimeEsleştirmeOyunu.tsx:115
KelimeEsleştirmeOyunu @ KelimeEsleştirmeOyunu.tsx:114
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopSync @ react-dom-client.development.js:15077
renderRootSync @ react-dom-client.development.js:15057
performWorkOnRoot @ react-dom-client.development.js:14525
performSyncWorkOnRoot @ react-dom-client.development.js:16364
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:16210
processRootScheduleInMicrotask @ react-dom-client.development.js:16249
(anonymous) @ react-dom-client.development.js:16383
elevenlabs.ts:195 ElevenLabs ses çalma hatası, fallback deneniyor: ElevenLabsAPIError: ElevenLabs API error: 401
    at ElevenLabsClient.textToSpeech (elevenlabs.ts:66:15)
    at async speak (elevenlabs.ts:180:18)
error @ intercept-console-error.ts:40
speak @ elevenlabs.ts:195
await in speak
handleAnswerClick @ KelimeEsleştirmeOyunu.tsx:85
onClick @ KelimeEsleştirmeOyunu.tsx:117
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
<div>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
(anonymous) @ KelimeEsleştirmeOyunu.tsx:115
KelimeEsleştirmeOyunu @ KelimeEsleştirmeOyunu.tsx:114
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopSync @ react-dom-client.development.js:15077
renderRootSync @ react-dom-client.development.js:15057
performWorkOnRoot @ react-dom-client.development.js:14525
performSyncWorkOnRoot @ react-dom-client.development.js:16364
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:16210
processRootScheduleInMicrotask @ react-dom-client.development.js:16249
(anonymous) @ react-dom-client.development.js:16383
report-hmr-latency.ts:26 [Fast Refresh] done in 1040ms
turbopack-hot-reloader-common.ts:41 [Fast Refresh] rebuilding
report-hmr-latency.ts:26 [Fast Refresh] done in 1080ms
elevenlabs.ts:199 Web Speech API ile ses başarıyla çalındı.
