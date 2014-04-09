
PREFIX="/opt/canopsis"
HUSER="canopsis"
HGROUP="canopsis"
ARCH=`uname -m`
SUDO="sudo -E"

function check_code() {
	if [ $1 -ne 0 ]; then
		echo -e "Error: Code: $1"
		echo -e "Output:\n$2"
		exit $1
	fi
}

function detect_os(){
	echo "Linux Distribution:"
	DIST=`python -c "import platform; print platform.dist()[0].lower()"`
	DIST_VERS=`python -c "import platform; print platform.dist()[1]"`
	echo "Dist found"
	echo $DIST
	echo $DIST_VERS
}

function launch_cmd() {
    CHECK=$1
    shift
    MYCMD=$*
    if [ "x$MYCMD" != "x" ]; then
        if [ "x`id -un`" == "x$HUSER" ]; then
            bash -c "$MYCMD"
            EXCODE=$?
            if [ $CHECK -eq 1 ]; then
                check_code $EXCODE "Error in command '$MYCMD'..."
            else
                return $EXCODE
            fi
        else
            if [ `id -u` -eq 0 ]; then
                su - $HUSER -c ". .bash_profile && $MYCMD"
                EXCODE=$?
                if [ $CHECK -eq 1 ]; then
                    check_code $EXCODE "Error in command '$MYCMD'..."
                else
                    return $EXCODE
                fi
            else
                echo "Impossible to launch command with '`id -un`' ..."
                exit 1
            fi
        fi
    fi
}

function detect_numa() {
	local CMD=`which numactl`
	if [ "x$CMD" != "x" ]; then
		$CMD --hardware | grep 'node' | grep 'cpus' | wc -l
	else
		echo 0
	fi
}
