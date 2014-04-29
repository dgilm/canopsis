#!/usr/bin/python

import os
import sys

def getFiles(f, path, plugin_name):
    f.write("[")
    idx = 0

    for directory, directories, files in os.walk(path):
        c_dir = directory.split('/')[-1]

        # don't add .git and files directories
        if c_dir != plugin_name and c_dir != ".git" and c_dir != "files":
            parent = os.path.split(os.path.abspath(directory))[0].split('/')[-1]

            # add separator if it is not the first element
            if idx: f.write(',')
            idx += 1

            f.write('{"type": "dir",')
            f.write('"name": "'+ directory.split('/')[-1] +'",')
            f.write('"files": [')

            for idx_, file_name in enumerate(files):
                if idx_: f.write(',')
                f.write('{"name": "'+ file_name +'"}')

            # close entry if there is no subdirectories
            if not len(directories): f.write(']}')

            # close entry if it's a subdirectory
            if parent != plugin_name and parent != "plugins": f.write(']}')


    f.write("]")


if __name__=="__main__":
    if len(sys.argv) != 2:
        print "Usage: available_files.py PATH"

    else:
        path = sys.argv[1]
        path = path if path[-1] == '/' else path + "/"

        for plugin in os.walk(path).next()[1]:
            getFiles(open(path+ plugin +"/files/files.json", "w"),
                     path+ plugin,
                     plugin)
