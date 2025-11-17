#!/usr/bin/env python3
"""
Package Version Watcher
Monitors a dependency version in package.json and syncs it across multiple projects.
"""
"""
 python watch_package.py --watch packages/client/package.json --dependency @ahmedrioueche/gympro-client --targets web/package.json backend/package.json
"""
import json
import subprocess
import sys
import time
from pathlib import Path
from typing import List, Optional
import argparse


class PackageWatcher:
    def __init__(
        self,
        watch_package_json: str,
        dependency_name: str,
        target_package_jsons: List[str],
        npm_token: Optional[str] = None,
        poll_interval: int = 5
    ):
        self.watch_path = Path(watch_package_json)
        self.dependency_name = dependency_name
        self.target_paths = [Path(p) for p in target_package_jsons]
        self.npm_token = npm_token
        self.poll_interval = poll_interval
        self.last_version = None

        # Validate paths
        if not self.watch_path.exists():
            raise FileNotFoundError(f"Watch package.json not found: {self.watch_path}")

        for target in self.target_paths:
            if not target.exists():
                raise FileNotFoundError(f"Target package.json not found: {target}")

    def get_dependency_version(self, package_json_path: Path) -> Optional[str]:
        """Get the version of the watched dependency from package.json"""
        try:
            with open(package_json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # Check if watching the package itself (by name)
            if 'name' in data and data['name'] == self.dependency_name:
                return data.get('version')

            # Check in dependencies
            if 'dependencies' in data and self.dependency_name in data['dependencies']:
                return data['dependencies'][self.dependency_name]

            # Check in devDependencies
            if 'devDependencies' in data and self.dependency_name in data['devDependencies']:
                return data['devDependencies'][self.dependency_name]

            return None
        except Exception as e:
            print(f"❌ Error reading {package_json_path}: {e}")
            return None

    def update_dependency_version(self, package_json_path: Path, new_version: str) -> bool:
        """Update the dependency version in a package.json file"""
        try:
            with open(package_json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            updated = False

            # Update in dependencies
            if 'dependencies' in data and self.dependency_name in data['dependencies']:
                data['dependencies'][self.dependency_name] = new_version
                updated = True

            # Update in devDependencies
            if 'devDependencies' in data and self.dependency_name in data['devDependencies']:
                data['devDependencies'][self.dependency_name] = new_version
                updated = True

            if updated:
                with open(package_json_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                    f.write('\n')  # Add trailing newline
                return True

            return False
        except Exception as e:
            print(f"❌ Error updating {package_json_path}: {e}")
            return False

    def run_npm_build(self, package_json_path: Path) -> bool:
        """Run npm run build in the directory of package.json"""
        try:
            work_dir = package_json_path.parent
            print(f"📦 Running npm run build in {work_dir}")

            result = subprocess.run(
                ['npm', 'run', 'build'],
                cwd=work_dir,
                capture_output=True,
                text=True,
                shell=True if sys.platform == 'win32' else False
            )

            if result.returncode == 0:
                print(f"✅ Build successful")
                return True
            else:
                print(f"❌ Build failed:\n{result.stderr}")
                return False
        except Exception as e:
            print(f"❌ Error running build: {e}")
            return False

    def run_npm_install(self, package_json_path: Path) -> bool:
        """Run npm install with NPM_TOKEN in the directory of package.json"""
        try:
            work_dir = package_json_path.parent
            print(f"📥 Running npm install in {work_dir}")

            env = None
            if self.npm_token:
                import os
                env = os.environ.copy()
                env['NPM_TOKEN'] = self.npm_token

            result = subprocess.run(
                ['npm', 'install'],
                cwd=work_dir,
                capture_output=True,
                text=True,
                env=env,
                shell=True if sys.platform == 'win32' else False
            )

            if result.returncode == 0:
                print(f"✅ npm install successful")
                return True
            else:
                print(f"❌ npm install failed:\n{result.stderr}")
                return False
        except Exception as e:
            print(f"❌ Error running npm install: {e}")
            return False

    def handle_version_change(self, new_version: str):
        """Handle when a version change is detected"""
        print(f"\n🔔 Version change detected: {self.dependency_name} → {new_version}")

        # Step 1: Build the watched package
        print(f"\n📦 Step 1: Building {self.watch_path}")
        if not self.run_npm_build(self.watch_path):
            print("⚠️ Build failed, stopping sync process")
            return

        # Step 2: Update all target package.json files
        print(f"\n📝 Step 2: Updating target package.json files")
        for target_path in self.target_paths:
            print(f"\n  → Updating {target_path}")
            if self.update_dependency_version(target_path, new_version):
                print(f"    ✅ Updated {self.dependency_name} to {new_version}")

                # Step 3: Run npm install
                self.run_npm_install(target_path)
            else:
                print(f"    ⚠️ Could not update (dependency not found in this file)")

        print(f"\n✨ Sync complete!\n")

    def watch(self):
        """Start watching for version changes"""
        print(f"👀 Watching {self.watch_path}")
        print(f"📦 Dependency: {self.dependency_name}")
        print(f"🎯 Targets: {len(self.target_paths)} package.json file(s)")
        print(f"⏱️  Checking every {self.poll_interval} seconds")
        print(f"{'='*60}\n")

        # Get initial version
        self.last_version = self.get_dependency_version(self.watch_path)
        if self.last_version:
            print(f"📌 Current version: {self.last_version}\n")
        else:
            print(f"⚠️ Dependency '{self.dependency_name}' not found in {self.watch_path}\n")

        try:
            while True:
                time.sleep(self.poll_interval)

                current_version = self.get_dependency_version(self.watch_path)

                if current_version and current_version != self.last_version:
                    self.handle_version_change(current_version)
                    self.last_version = current_version

        except KeyboardInterrupt:
            print(f"\n\n👋 Stopping watcher...")
            sys.exit(0)


def get_npm_token() -> Optional[str]:
    """Try to get NPM token from .npmrc file"""
    try:
        npmrc_paths = [
            Path.home() / '.npmrc',
            Path('.npmrc')
        ]

        for npmrc_path in npmrc_paths:
            if npmrc_path.exists():
                with open(npmrc_path, 'r') as f:
                    for line in f:
                        # Check for both NPM and GitHub registry tokens
                        if '/:_authToken=' in line:
                            token = line.split('=', 1)[1].strip()
                            return token
        return None
    except Exception:
        return None

def main():
    parser = argparse.ArgumentParser(
        description='Watch a dependency version in package.json and sync it to other projects',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  # Watch a local package and sync to multiple projects
  python watch_package.py \\
    --watch ../packages/client/package.json \\
    --dependency @ahmedrioueche/gympro-client \\
    --targets ../web/package.json ../mobile/package.json \\
    --interval 5

  # With custom NPM token
  python watch_package.py \\
    --watch ./package.json \\
    --dependency my-package \\
    --targets ../app1/package.json ../app2/package.json \\
    --token "your-npm-token"
        '''
    )

    parser.add_argument(
        '--watch',
        required=True,
        help='Path to package.json to watch'
    )

    parser.add_argument(
        '--dependency',
        required=True,
        help='Name of the dependency to watch'
    )

    parser.add_argument(
        '--targets',
        nargs='+',
        required=True,
        help='Paths to target package.json files to update'
    )

    parser.add_argument(
        '--token',
        help='NPM token (will try to read from .npmrc if not provided)'
    )

    parser.add_argument(
        '--interval',
        type=int,
        default=5,
        help='Polling interval in seconds (default: 5)'
    )

    args = parser.parse_args()

    # Get NPM token
    npm_token = args.token or get_npm_token()
    if npm_token:
        print(f"🔑 NPM token found\n")
    else:
        print(f"⚠️ No NPM token found (will use default npm config)\n")

    # Create and start watcher
    watcher = PackageWatcher(
        watch_package_json=args.watch,
        dependency_name=args.dependency,
        target_package_jsons=args.targets,
        npm_token=npm_token,
        poll_interval=args.interval
    )

    watcher.watch()


if __name__ == '__main__':
    main()
