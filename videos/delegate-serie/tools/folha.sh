#!/bin/zsh
# folha de contacto: tools/folha.sh saida.png img1 img2 ... (3 colunas, 640x360 cada)
out=$1; shift
n=$#; cols=3; rows=$(( (n + cols - 1) / cols ))
inputs=(); filt=""; i=0
for f in "$@"; do inputs+=(-i "$f"); filt+="[${i}:v]scale=640:360,drawtext=text='$(basename $f .png)':x=8:y=8:fontfile=/System/Library/Fonts/Supplemental/Arial.ttf:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6[v$i];"; i=$((i+1)); done
pad=$(( rows*cols - n )); for ((k=0;k<pad;k++)); do filt+="color=black:640x360,trim=end_frame=1[v$i];"; i=$((i+1)); done
lay=""; for ((k=0;k<i;k++)); do lay+="[v$k]"; done
ffmpeg -y -loglevel error "${inputs[@]}" -filter_complex "${filt}${lay}xstack=inputs=${i}:layout=$(python3 -c "
c=$cols;r=$rows
print('|'.join(f'{(k%c)*640}_{(k//c)*360}' for k in range(c*r)))")" -frames:v 1 "$out"
