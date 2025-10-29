# 🔧 Troubleshooting Guide - jsdom Interactive Prompt Issue

## Issue Summary

When running `npm run test:run`, Vitest was prompting interactively:

```
MISSING DEPENDENCY  Cannot find dependency 'jsdom'
√ Do you want to install jsdom? ... 
```

## Root Cause

The issue was caused by **an invalid `package.json` file in a parent directory**:

**Location**: `C:\Users\gsole\dev\prj\github\package.json`

**Problem**: The file contained invalid JSON syntax:
```json
{name: github, version: 1.0.0}
```

**Why it was invalid**:
- ❌ Property names must be in double quotes: `"name"` not `name`
- ❌ String values must be in double quotes: `"github"` not `github`

## How It Affected Testing

1. **Node.js module resolution** walks up the directory tree looking for `package.json` files
2. When it encountered the **invalid JSON**, it threw a parsing error
3. This caused Vitest's dependency checker to **fail**
4. The failure triggered an **interactive prompt** asking to install jsdom
5. Even though jsdom **was already installed**, Vitest couldn't detect it properly

## The Fix

### Fixed the parent package.json file:

**Before** (Invalid):
```json
{name: github, version: 1.0.0}
```

**After** (Valid):
```json
{
  "name": "github",
  "version": "1.0.0"
}
```

### Command used to fix:
```bash
printf '{\n  "name": "github",\n  "version": "1.0.0"\n}\n' > /c/Users/gsole/dev/prj/github/package.json
```

## Verification

After fixing the parent `package.json`, tests now run **without any prompts**:

```bash
$ npm run test:run

✓ src/App.test.jsx (11 tests) 41ms
Test Files  1 passed (1)
Tests       11 passed (11)
```

✅ **No more interactive prompts**  
✅ **No more JSON parsing errors**  
✅ **Tests run cleanly in CI/CD mode**

## How to Prevent This Issue

### 1. Validate package.json files
Use a JSON validator or run:
```bash
node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))"
```

### 2. Use proper JSON syntax
- Always use **double quotes** for property names and string values
- Never use single quotes in JSON
- Use a linter or IDE that validates JSON

### 3. Check parent directories
If you encounter weird module resolution errors, check for:
```bash
# Check parent directories for package.json
ls ../package.json
ls ../../package.json
```

## Additional Notes

### Why the error showed "jsdom" specifically

Vitest uses jsdom for DOM testing. When the module resolution failed due to the corrupt parent `package.json`, Vitest's first check (for jsdom) failed, triggering the interactive installer prompt.

### Why tests still passed

Even with the error, tests passed because:
1. The error was only in the **dependency resolution phase**
2. Once you pressed "N" (no), Vitest continued
3. jsdom was **already available** in the project's `node_modules`
4. The actual test execution succeeded

## Related Files

- **Project package.json**: `C:\Users\gsole\dev\prj\github\screen-board\package.json` ✅ Valid
- **Parent package.json**: `C:\Users\gsole\dev\prj\github\package.json` ✅ Fixed

## Summary

✅ **Problem**: Invalid JSON in parent directory's package.json  
✅ **Solution**: Fixed the JSON syntax to be valid  
✅ **Result**: Tests now run without any prompts or errors  

---

*Issue Resolved: October 29, 2025*  
*Resolution Time: ~5 minutes*  
*Status: FIXED ✅*

