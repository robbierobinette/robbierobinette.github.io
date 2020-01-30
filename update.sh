#!/bin/bash

bundledDir=target/scala-2.12/scalajs-bundler/main
for module in RCVSimulationPage cSim populationWidget; do
	mkdir -p $module/$bundledDir
	lc_module=`echo $module | tr '[A-Z]' '[a-z]'`
	for component in fastopt-library.js fastopt-loader.js fastopt.js ; do
		cp ../ssjs/$module/$bundledDir/$lc_module-$component $module/$bundledDir/
	done
done

cp ../ssjs/{rcv,c-sim,populationWidget}.html .
