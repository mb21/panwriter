# Windows Dev PC – Build & Environment Adjustments  
**Document ID:** panwriter-windows-dev-notes  
**Version:** 1.0  
**Created:** 2025-11-28  
**Source Transcript:** `Claude Code _ Claude-2025-11-28T17-56-04.500Z.md`  
**Scope:** Windows-specific issues encountered on the developer PC and the compensations required to complete each build step successfully.  
**Status:** ✅ STABLE REFERENCE (CLOSED)  

**Intended Audience:**  
- LLMs and human developers working on this project from a Windows development machine.  
- Tools generating or checking build instructions for Electron/React apps on Windows.

**LLM Usage Rules:**  
- Treat this as a **reference document**, not an ongoing conversation.  
- Do **not** “continue” or improvise new troubleshooting beyond what is recorded here.  
- For new problems, create **new** sections/documents instead of extending closed ones.

---

## 1. Environment Context  ✅ COMPLETED

- Project: PanWriter (Electron + React markdown editor).  
- Goal:  
  - Implement and test scroll-sync fixes.  
  - Build a Windows installer and unpacked binaries on a Windows development PC.  
- OS on dev machine: Windows 11 (electron-builder logs show `os=10.0.22621`).  

The build pipeline involved:

1. React production build (Create React App / `react-scripts`).  
2. TypeScript build for Electron (`npm run electron:tsc`).  
3. Packaging with `electron-builder` to produce Windows installer and unpacked binaries.

---

## 2. Issue: Unix-Style Env Var in NPM Script Fails on Windows  ✅ COMPLETED

### 2.1 Symptom

Running the documented distribution command from PowerShell:

```powershell
PS C:\dev\projects\github\panwriter> npm run dist
````

Produced:

```text
> panwriter@0.8.9 dist npm run electron:build && electron-builder
> panwriter@0.8.9 electron:build npm run build && npm run electron:tsc
> panwriter@0.8.9 build INLINE_RUNTIME_CHUNK=false react-scripts --openssl-legacy-provider build

'INLINE_RUNTIME_CHUNK' is not recognized as an internal or external command,
operable program or batch file.
```

### 2.2 Root Cause

* `package.json` uses a **Unix-style** environment variable prefix in the `build` script:

  ```bash
  INLINE_RUNTIME_CHUNK=false react-scripts --openssl-legacy-provider build
  ```

* This syntax is valid in POSIX shells (Linux/macOS, Git Bash, WSL) but **not** in `cmd.exe` or PowerShell.

* On the Windows dev PC, the script is interpreted literally, so `INLINE_RUNTIME_CHUNK` is treated as a command and fails.

### 2.3 Recorded Options

The transcript enumerated three approaches to compensate for this on Windows.

1. **Option 1 – PowerShell with manual environment variable (Chosen):**

   ```powershell
   $env:INLINE_RUNTIME_CHUNK="false"
   npx react-scripts --openssl-legacy-provider build
   npm run electron:tsc
   npx electron-builder
   ```

2. **Option 2 – Use Git Bash or WSL:**

   * Run the original NPM script from a POSIX-like shell:

     ```bash
     npm run dist
     ```

3. **Option 3 – Make the script cross-platform with `cross-env`:**

   * Install:

     ```bash
     npm install --save-dev cross-env
     ```

   * Update `package.json` script:

     ```json
     "build": "cross-env INLINE_RUNTIME_CHUNK=false react-scripts --openssl-legacy-provider build"
     ```

   * This would allow `npm run build` / `npm run dist` to function on all platforms.

### 2.4 Actual Compensation Used on the Windows Dev PC

**Chosen approach:** Option 1 (manual env var + explicit commands in PowerShell).

Concrete sequence executed on the Windows dev machine:

1. **React production build:**

   ```powershell
   PS C:\dev\projects\github\panwriter> $env:INLINE_RUNTIME_CHUNK="false"
   PS C:\dev\projects\github\panwriter> npx react-scripts --openssl-legacy-provider build
   ```

   * Build produces warnings but completes successfully (see Issue 3).

2. **Electron TypeScript build:**

   ```powershell
   PS C:\dev\projects\github\panwriter> npm run electron:tsc
   ```

   * Runs `tsc -p electron` and completes.

3. **Windows packaging:**

   ```powershell
   PS C:\dev\projects\github\panwriter> npx electron-builder
   ```

Later, the same two commands (`electron:tsc` + `electron-builder`) are also recorded as a combined suggestion:

```powershell
npm run electron:tsc && npx electron-builder
```

**Status:**

* ✅ Issue understood and worked around.
* ❌ `package.json` scripts were **not** modified in this session (cross-env option left as a potential future improvement).

---

## 3. Issue: Source Map Warnings from `markdown-it-gridtables`  ✅ COMPLETED

### 3.1 Symptom

During the `react-scripts` build on the Windows dev machine, multiple warnings appeared:

```text
Failed to parse source map from 'C:\dev\projects\github\panwriter\node_modules\markdown-it-gridtables\src\common\gridtables\GetCells.ts' file: Error: ENOENT: no such file or directory, open 'C:\dev\projects\github\panwriter\node_modules\markdown-it-gridtables\src\common\gridtables\GetCells.ts'
Failed to parse source map from 'C:\dev\projects\github\panwriter\node_modules\markdown-it-gridtables\src\common\gridtables\GetColumnWidths.ts' file: Error: ENOENT: no such file or directory, open 'C:\dev\projects\github\panwriter\node_modules\markdown-it-gridtables\src\common\gridtables\GetColumnWidths.ts'
...
Failed to parse source map from 'C:\dev\projects\github\panwriter\node_modules\markdown-it-gridtables\src\rules\gridtable.ts' file: Error: ENOENT: no such file or directory, open 'C:\dev\projects\github\panwriter\node_modules\markdown-it-gridtables\src\rules\gridtable.ts'
```

These appear together with standard CRA deployment notes and confirmation the build folder is ready.

### 3.2 Root Cause

* The warnings originate from the `markdown-it-gridtables` dependency’s source maps, not from the project code itself.
* On the Windows dev PC, these paths are resolved to `C:\dev\projects\github\panwriter\...`, but the `.ts` source files referenced by the source maps are not present in `node_modules`.

### 3.3 Interpretation and Compensation

* The build **succeeds**, and the warnings are explicitly documented as safe to ignore:

  > “Build succeeded. The warnings about source maps are just from a dependency (markdown-it-gridtables) and don't affect the build.”

* No changes were made to the code or configuration on the Windows dev PC for this issue.

* The only “compensation” is an explicit decision to **treat these as noise** and proceed.

**Status:**

* ✅ Acknowledged as harmless dependency-level warnings.
* ✅ No action required to complete the build or run the app on Windows.

---

## 4. Issue: Electron-Builder Signing Warnings on Windows  ✅ COMPLETED

### 4.1 Symptom

`electron-builder` logs multiple messages related to signing:

```text
• signing with signtool.exe path=dist\win-unpacked\PanWriter.exe
  • no signing info identified, signing is skipped signHook=false cscInfo=null
...
• signing with signtool.exe path=dist\PanWriter Setup 0.8.9.exe
  • no signing info identified, signing is skipped signHook=false cscInfo=null
```

### 4.2 Root Cause

* The Windows dev PC has **no code-signing certificate** configured for this project.
* `electron-builder` attempts to use `signtool.exe` but finds no signing configuration (`cscInfo=null`).

### 4.3 Interpretation and Compensation

* The transcript explicitly states:

  > “The signing warnings are normal - they just indicate no code signing certificate is configured (the app will still work, Windows may show a warning when running unsigned software).”

* No build failures occur; installer and binaries are successfully produced.

**Status:**

* ✅ Warnings accepted as expected behavior on an unsigned dev machine.
* 📋 Potential future improvement: configure code signing for production, but **not** required to complete these steps.

---

## 5. Outputs Verified on the Windows Dev PC  ✅ COMPLETED

After running the compensated build sequence, electron-builder produced:

* **Windows installer:**

  ```text
  dist\PanWriter Setup 0.8.9.exe
  ```

* **Unpacked directories:**

  * `dist\win-unpacked\` (Windows x64).
  * `dist\win-arm64-unpacked\` (Windows ARM64).

Verification on the Windows dev PC:

* The stand-alone `PanWriter.exe` in `dist\win-unpacked\` was executed successfully.
* The NSIS installer `PanWriter Setup 0.8.9.exe` installed and ran successfully.
* The transcript confirms that both “stand-alone exe” and installer “worked as well, and seems to be working well.”

**Status:**

* ✅ Build and packaging steps validated end-to-end on the Windows dev machine.

---

## 6. Windows-Specific Runtime Behavior Considerations  ✅ COMPLETED

These items did not block the build itself, but they are important **Windows-specific factors** that motivated code-level changes and testing on the Windows dev PC.

### 6.1 Scroll Sync Sensitivity to Windows Characteristics

Analysis identified the following Windows-specific influences on scroll sync behavior:

* **High DPI scaling:**

  * 125–200% scaling on Windows enlarges scroll ranges and increases the effective pixel counts, making sparse `reverseScrollMap` lookups slower and more error-prone.

* **Timer resolution:**

  * Windows default timer resolution is ~15.625 ms, so a “30 ms” throttle effectively fires anywhere between ~15–45 ms, adding jitter.

* **Scrollbar differences and layout:**

  * Windows 10 vs 11 differences in scrollbar width/auto-hide behavior affect layout measurements that rely on `offsetWidth - clientWidth`.

These factors, combined with a sparse scroll map and O(n) reverse lookup, caused **Windows-only** or **Windows-worse** scroll sync bugs.

### 6.2 Code-Level Compensations (Affecting All Platforms, Motivated by Windows)

To make scroll sync acceptable on Windows, the implementation was updated (summarized from the transcript):

* Replaced O(n) reverse search with **binary search** over a sorted list of entries.
* Replaced fixed 30 ms throttling with `requestAnimationFrame`, reducing Windows timer jitter.
* Normalized rounding to `Math.round()` for consistency.
* Added interpolation between scroll map entries and initial entry at position 0.
* Added feedback-loop prevention via scroll-source tracking and clamping at document end.

These changes are **not** “environment hacks” but are important to understand why Windows behavior on the dev PC drove the fixes.

**Status:**

* ✅ Runtime behavior issues on Windows understood and compensated via code.
* ✅ No additional OS-level tweaks required on the developer PC beyond DPI/behavior awareness.

---

## 7. Step-by-Step Recipe for This Windows Dev PC  ✅ COMPLETED

This section summarizes the **exact steps** that worked reliably on the Windows development machine, including all compensations.

### 7.1 Build & Package Sequence (PowerShell)

From a PowerShell prompt in the project root:

1. **Set environment variable and build React app:**

   ```powershell
   PS C:\dev\projects\github\panwriter> $env:INLINE_RUNTIME_CHUNK="false"
   PS C:\dev\projects\github\panwriter> npx react-scripts --openssl-legacy-provider build
   ```

   * Accept source-map warnings from `markdown-it-gridtables` as harmless.

2. **Build Electron TypeScript:**

   ```powershell
   PS C:\dev\projects\github\panwriter> npm run electron:tsc
   ```

3. **Package Windows binaries and installer:**

   ```powershell
   PS C:\dev\projects\github\panwriter> npx electron-builder
   ```

   * Ignore signing warnings as expected for an unsigned dev environment.

### 7.2 Resulting Artifacts

* Installer: `dist\PanWriter Setup 0.8.9.exe`
* Unpacked binaries:

  * `dist\win-unpacked\PanWriter.exe` (x64)
  * `dist\win-arm64-unpacked\PanWriter.exe` (ARM64)

Both the unpacked binary and the installer were successfully run and validated on the Windows dev PC.

---

## 8. Closed Topics & Boundaries

* Windows-specific build issues for this session are **fully documented** above.
* Scroll-sync behavior is **improved but not perfect**; remaining drift is accepted as a known limitation for now.

**Closed Topics:**

* ✅ Workarounds for Unix-style env vars in `package.json` on Windows.
* ✅ Handling of source-map warnings from `markdown-it-gridtables`.
* ✅ Treatment of electron-builder signing warnings on an unsigned Windows dev machine.
* ✅ Verified build & run steps for PanWriter on the Windows dev PC.

**Boundary Marker:**
`<DO_NOT_CONTINUE>` – Future LLMs and tools should **not** try to “resume” troubleshooting from this document. For new problems, create a new document and reference this one as historical context.
