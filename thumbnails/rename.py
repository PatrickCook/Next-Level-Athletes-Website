import os
fileNum = 0;

for file in os.listdir("."):
    if file.startswith("default") != True and file.endswith("py") != True and file != ".DS_Store":
        os.rename(file, str(fileNum).zfill(4) + ".jpg")
        fileNum+=1;
