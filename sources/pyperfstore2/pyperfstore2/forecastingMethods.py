import logging

logger = logging.getLogger('forecasting_statsMethods')
logger.setLevel(logging.DEBUG)


#----------------------------forecast methods----------------------------------
###############################################################################
# validateSerie : Recovery of last continued background of numerical serie
#
#
###############################################################################
def validateSerie( aggregatedValuesByTime ):

	logger.debug( 'validate_serie' )

	validity = '' 
		
	length_AggregatedValuesByTime = len( aggregatedValuesByTime )
	aggregatedValues = [ value[1] for value in aggregatedValuesByTime ]
		
		   
	try :
		none = aggregatedValues.index(None)
		logger.debug( 'there is None in aggregation list : %s', str( none) )
		noneValueIndices = []

		for indice in xrange( length_AggregatedValuesByTime ):

			if aggregatedValues[ indice ]==None :
				noneValueIndices.append( indice )
					
		logger.debug( 'None value number : %s' % len( noneValueIndices ) )

		if len( noneValueIndices ) == length_AggregatedValuesByTime :
			validity = 'none'
			firstValidIndice = -1

		else:
			validity = 'by period'
			firstValidIndice = noneValueIndices[-1]+1


	except Exception, e: 
		logger.debug( 'Error : %s', e )
		logger.debug( 'No "None" in the dataset' )
		validity = 'all'
		firstValidIndice = 0

	logger.debug( 'validity : %s' % validity )
	logger.debug( 'firstValidIndice : %s' % firstValidIndice )


	return { 'validity' : validity, 
			 'firstValidIndice' : firstValidIndice }

###############################################################################
#   :Detect if values in the serie correspond in alerts
#
#
###############################################################################

def detectAlerts( serie, alertList ):
	logger.debug('detectAlerts')

	for alert in alertList :
			
		alertValue = alert[0]
		alertOperator = alert[1]
		detectedAlerts = list()

		if alertOperator == '=' :

			for value in serie :

				if value[1] == alertValue :
					detectedAlerts.append( value[0], value[1], alert)
					break

		elif alertOperator == '<=' :

			for value in serie :

				if value[1] <= alertValue :
					detectedAlerts.append( value[0], value[1], alert)
					break

		elif alertOperator == '>=':

			for value in serie :

				if value[1] >= alertValue :
					detectedAlerts.append( value[0], value[1], alert)
					break

		elif alertOperator == '<':

			for value in serie :

				if value[1] < alertValue :
					detectedAlerts.append( value[0], value[1], alert)
					break

		elif alertOperator == '>' :

			for value in serie :

				if value[1] > alertValue :
					detectedAlerts.append( value[0], value[1], alert)
					break

	return detectedAlerts

#------------------------ Mathematical methods --------------------------------

###############################################################################
# calculateRMSE
#
#
###############################################################################
def calculateRMSE(  dataset1, dataset2 ):

	logger.debug(  'calculateRMSE')

	timePointNb = len(dataset1)

	if timePointNb != len(dataset2) :
		logger.debug(  'length of datasets no compatible' )
		return -1
	else:
		SCR = 0

		logger.debug(  'dataset1 : %s' % dataset1 )
		logger.debug(  'dataset2 : %s' % dataset2 )

		#for timePoint1,timePoint2 in dataset1,dataset2 :
		for t in xrange( timePointNb ) :
			#logger.debug( "t : %s" % t)
			timePoint1 = dataset1[t]
			timePoint2 = dataset2[t]
			#logger.debug( "tp1 : %s" % timePoint1)
			#logger.debug( "tp2 : %s" % timePoint2)
			SCR+=float( ( timePoint1[1]-timePoint2[1] )**2 )

		MSE = SCR/float(timePointNb)

		logger.debug(  'MSE : %s ' % MSE )

		RMSE = MSE**0.5

		logger.debug(  'RMSE : %s ' % RMSE )

		return RMSE


###############################################################################
#
###############################################################################
def calculateAutoCorrelation(  serie ):

	logger.debug(  'calculateAutoCorrelation')

	y0 = [ 0 for val in serie ]
	autoCorrelationSerie = [ [0,0] for val in serie ]
	serieValues = [ val[1] for val in serie  ]

	serieMean = sum( serieValues )/len(serieValues)

	for p in xrange( len(serie) ):
		autoCorrelationSerie[p][0] = p 	
						
		for n in xrange( len(serie) ):
			autoCorrelationSerie[p][1]+=(serie[n][1]-serieMean)*(serie[n-p][1]-serieMean)


	logger.debug(  'Auto-correlation serie : %s ' % autoCorrelationSerie ) 
	return autoCorrelationSerie

###############################################################################
#
###############################################################################
def calculateMobileMean( serie, degree ):
	serie_size = len( serie )
	mobileAverageSerie  = list()
	foot = int(degree)/2

	if degree%2 != 0 :

		for i in xrange( foot, serie_size - foot):
			mobileMean = 0.0

			for f in xrange(-foot,foot+1):
				mobileMean+= float( serie[i+f][1] )

			mobileMean/=float(degree)

			mobileAverageSerie.append( [ serie[i][0], mobileMean ] )

	else:

		for i in xrange( foot, serie_size - foot):

			mobileMean = float( serie[i-foot][1])/2.0

			for f in xrange( -foot+1, foot ):
				mobileMean+=float(serie[i+f][1])

			mobileMean+= float(serie[i+foot][1])/2.0
			mobileMean/=float(degree)

			mobileAverageSerie.append( [ serie[i][0], mobileMean ] )

	logger.debug( 'mobileAverageSerie : %s' % mobileAverageSerie )

	return mobileAverageSerie


#------------------------ Optimization methods --------------------------------


###############################################################################
#
###############################################################################
def detectParticularPoints( serie ):
	logger.debug(  ' detectParticularPoints ')

	summits = list()
	hollow = list()
	passes = list()

	for i in xrange( 1,len(serie)-1 ):
  
		if( serie[i-1][1] < serie[i][1] and serie[i+1][1] < serie[i][1] ):
			summits.append(serie[i])

		if( serie[i-1][1] > serie[i][1] and serie[i+1][1] > serie[i][1] ):
			hollow.append(serie[i])			

		if( ( serie[i][1] > 0 and serie[i+1][1] < 0 ) or 
			   ( serie[i][1] < 0 and serie[i+1][1] > 0 ) ):
			passes.append(serie[i])

	logger.debug(  'summits : %s' % summits )
	logger.debug( '' )
	logger.debug(  'hollow : %s' % hollow )
	logger.debug( '' )
	logger.debug(  'passes : %s' % passes )

	return {'summits' : summits, 
			'hollow' : hollow,
			'passes' : passes }


###############################################################################
#
###############################################################################
def calculateSeasonality( serie ):

	autoCorrelationSerie = calculateAutoCorrelation(serie)
	autoCorrelationParticularPoints = detectParticularPoints(autoCorrelationSerie)
	passNb = len( autoCorrelationParticularPoints['passes'] )

	if passNb == 2  :
		logger.debug( 'Serie is linear and doesnt have periodicity ')
		return None
			
	else:
		hollowMean = 0
		hollowNb = 0
		if len( autoCorrelationParticularPoints['hollow'] ) != 0 :
			#seasonality = float( len( autoCorrelationSerie) )/ float(len( autoCorrelationParticularPoints['hollow'] ) )
			for h in xrange( len( autoCorrelationParticularPoints['hollow'])-1):
				hollowNb+=1
				hollowMean+=(autoCorrelationParticularPoints['hollow'][h+1][0]-autoCorrelationParticularPoints['hollow'][h][0])

			seasonality = int(float(hollowMean)/float(hollowNb))
		else:
			return None

		logger.debug( 'Seasonality of the serie : %s' % seasonality )
	
		return seasonality


###############################################################################
#
###############################################################################
def detectOutliersOrTrendChanges( serie,smoothing, maxError ):

	logger.debug(  'detectOutliersOrTrendChanges')
	logger.debug(  '')
	logger.debug(  'serie : %s' % serie )
	logger.debug(  '')
	logger.debug(  'smoothing : %s' % smoothing )
	indiceRecord = {}
	indiceRecord['trendChange'] = -1
	outliers = []

	timePointNb = len(serie)

	if timePointNb != len(smoothing) :
		logger.debug(  'length of datasets no compatible' )
		return -1
	else:

		outlier = False

		for t in xrange(timePointNb) :
			timePoint1 = serie[t]
			timePoint2 = smoothing[t]
			RMSE = calculateRMSE( [timePoint1], [timePoint2] )

			maxValue = max(timePoint1,timePoint2)
			
			if maxValue != 0.0 :
				relativeError = abs(RMSE/maxValue)
			else:
				relativeError = 0.0

			logger.debug( "t : %s, relative error : %s " % (t,relativeError))

			if relativeError > maxError :

				for tbis in xrange(t+1,timePointNb) :
					timePoint1 = serie[tbis]
					timePoint2 = smoothing[tbis]
					RMSE = calculateRMSE( [timePoint1], [timePoint2] )

					if timePoint2[1] != 0.0 :
						relativeError = abs(RMSE/timePoint2[1])
					elif timePoint1[1] != 0.0 :
						relativeError = abs(RMSE/timePoint1[1])
					else:
						relativeError = 0.0

					if relativeError < maxError :
						outliers.append(t)
						outlier = True
						break

				if outlier == False :
					indiceRecord['trendChange'] = t
					indiceRecord['outliers'] = outliers
					return indiceRecord


	logger.debug( 'outlier list : %s' % outliers )
	indiceRecord['outliers'] = outliers 
	return indiceRecord

###############################################################################
#
##############################################################################
def deleteOutliers(serie, outliers ):
	serieWithoutOutliers = []

	for indice in xrange( len(serie) ) :

		if indice not in outliers :
			serieWithoutOutliers.append(serie[indice])

	logger.debug( 'outlier list : %s' % serieWithoutOutliers )
	return serieWithoutOutliers

###############################################################################
#
###############################################################################
def repairOutliers(serie, outliers, optimizedParameters ):
	correctedSerie = list( serie )

	for indice in outliers :
		logger.debug("indice : %s" % indice )
		
		#Search first data in serie who isn't in outlier lsit
		for i in xrange(1, indice):
			indice_noOutlier = indice-i
			if indice_noOutlier not in outliers :
				break



		if optimizedParameters['method'] == 'h_linear' :
			forecast = calculateHoltWintersLinearMethod( correctedSerie[0:indice_noOutlier+1], 
														 indice-indice_noOutlier,
														 optimizedParameters['alpha'],
														 optimizedParameters['beta'] )

		elif optimizedParameters['method'] == 'hw_additive' :
			forecast = calculateHoltWintersAdditiveSeasonalMethod( correctedSerie[0:indice_noOutlier+1], 
																   indice-indice_noOutlier,
																   optimizedParameters['seasonality'],
																   optimizedParameters['alpha'],
																   optimizedParameters['beta'],
																   optimizedParameters['gamma'] )

		elif optimizedParameters['method'] == 'hw_multiplicative' :
			forecast = calculateHoltWintersMultiplicativeSeasonalMethod( correctedSerie[0:indice_noOutlier+1],
																		 indice-indice_noOutlier,
																		 optimizedParameters['seasonality'],
																		 optimizedParameters['alpha'],
																		 optimizedParameters['beta'],
																		 optimizedParameters['gamma'] )

		logger.debug("old | new value : %s | %s" % (correctedSerie[indice],
													forecast[-1] ) )
		correctedSerie[indice] = forecast[-1]


	return correctedSerie


###############################################################################
#
#
###############################################################################
def optimiseHoltWintersAlgorithm( serie, seasonality=None, method=None ):
	logger.debug('optimiseHoltWintersAlgorithm')

	alpha = [ 0.1*i for i in xrange(1,10) ]
	beta = [ 0.1*i for i in xrange(1,10) ]
	gamma = [ 0.1*i for i in xrange(1,10) ]

	if seasonality == None :
		seasonality = calculateSeasonality(serie)
	
	if seasonality == None :
		method = 'h_linear'

	logger.debug(" seasonality : %s" % seasonality )
	logger.debug(" method : %s" % method )

	optimizeCoeffAndMethod = { 'seasonality' : seasonality }
	optimizeCoeffAndMethod['alpha']= 0.1
	optimizeCoeffAndMethod['beta'] = 0.1

	serieLength = len(serie)
	serieTestLength = int(float(serieLength)/2.0)
	serieTest = serie[0:serieTestLength]
	duration = serieLength - serieTestLength

	if method == None :

		optimizeCoeffAndMethod['gamma'] = 0.1

		for a in alpha :

			for b in beta :

				for c in gamma :
					addForecastingTest = calculateHoltWintersAdditiveSeasonalMethod( serieTest, 
																					 duration,
																					 seasonality,
																					 a,b,c )

					multiForecastingTest = calculateHoltWintersMultiplicativeSeasonalMethod( serieTest,
																							 duration,
																							 seasonality, 
																							 a,b,c )

					addError = calculateRMSE(serie,addForecastingTest[:serieLength])

					multiError = calculateRMSE(serie,multiForecastingTest[:serieLength])
					
					#logger.debug( 'addError,multiError : %s,%s ' % ( addError,multiError ) )

					if b==0.1 and a==0.1 and c==0.1 :
						error = addError


					if addError > multiError and error > multiError :
						error = multiError	
						method='hw_multiplicative'
						optimizeCoeffAndMethod['alpha']= a
						optimizeCoeffAndMethod['beta'] = b
						optimizeCoeffAndMethod['gamma'] = c

					elif multiError > addError and error > addError :
						error = addError
						method='hw_additive'
						optimizeCoeffAndMethod['alpha']= a
						optimizeCoeffAndMethod['beta'] = b
						optimizeCoeffAndMethod['gamma'] = c

	else:

		if method == 'h_linear':

			for a in alpha :

				for b in beta :	
					#logger.debug(  'a,b : %s,%s' % (a,b) )
					linearForecastingTest = calculateHoltWintersLinearMethod(serieTest, duration, a,b )
					linearForecastingError = calculateRMSE(serie,linearForecastingTest[:serieLength])

					if b==0.1 and a==0.1 :
						error = linearForecastingError

					#logger.debug(  'linearForecastingError : ',linearForecastingError
					if error > linearForecastingError :
						error = linearForecastingError
						optimizeCoeffAndMethod['alpha']= a
						optimizeCoeffAndMethod['beta'] = b

		elif method == 'hw_additive' : 
			optimizeCoeffAndMethod['gamma'] = 0.1

			for a in alpha :

				for b in beta :

					for c in gamma :
						addForecastingTest = calculateHoltWintersAdditiveSeasonalMethod( serieTest, 
																					 duration,
																					 seasonality,
																					 a,b,c )

						addError = calculateRMSE(serie,addForecastingTest[:serieLength])

						if b==0.1 and a==0.1 and c==0.1:
							error = addError

						if error > addError :
							error = addError
							optimizeCoeffAndMethod['alpha']= a
							optimizeCoeffAndMethod['beta'] = b
							optimizeCoeffAndMethod['gamma'] = c


		elif method == 'hw_multiplicative' : 

			optimizeCoeffAndMethod['gamma'] = 0.1

			for a in alpha :

				for b in beta :

					for c in gamma :
						multiForecastingTest = calculateHoltWintersMultiplicativeSeasonalMethod( serieTest, 
																							   duration,
																							   seasonality,
																							   a,b,c )

						multiError = calculateRMSE(serie,multiForecastingTest[:serieLength])

						if b==0.1 and a==0.1 and c==0.1 :
							error = multiError

						if error > multiError :
							error = multiError
							optimizeCoeffAndMethod['alpha']= a
							optimizeCoeffAndMethod['beta'] = b
							optimizeCoeffAndMethod['gamma'] = c

	optimizeCoeffAndMethod['method'] = method

	logger.debug(  'optimizeCoeffAndMethod : %s' % optimizeCoeffAndMethod )

	return optimizeCoeffAndMethod

#---------------------- Holt-Winters methods ---------------------------------- 

###############################################################################
#
#
#
###############################################################################

def calculateHoltWintersLinearMethod( serie, duration, alpha=0.3, beta=0.1,callback=None ):
	logger.debug('calculateHoltWintersLinearMethod')	
	#logger.debug(  "##########################################################" )
	#logger.debug(  " Initial values " )
	#logger.debug(  '%s' % serie )
	#logger.debug(  "##########################################################" )

	serieLength = len(serie)
	logger.debug( 'Length of the serie : %s' % serieLength )

	if serieLength < duration :
		logger.debug(  ' We  have a insufficient number of numerical values to calculate forecasting ' )
		return []
		 
	else:  
		forecastingDuration = serieLength + duration

		# Serie of coefficients ( trend ) 
		level = [0]*serieLength
		trend = [0]*serieLength
		forecastingSerie = [0]*forecastingDuration
	
		logger.debug(  ' forecasting duration :  %s ' % forecastingDuration )
		
		# Initialization
		level[0] = serie[0][1]
		trend[0] = serie[1][1] - serie[0][1] 
		forecastingSerie[0] = [ serie[0][0], level[0] ]
		forecastingSerie[1] = [ serie[1][0], level[0] + trend[0] ]

		if 1 >= serieLength - duration  :
			tp = serie[0][0] + duration*( serie[-1][0]-serie[-2][0] )
			forecastingSerie[ duration ] = [ tp, level[0]+duration*trend[0] ] 

		for t in xrange( 1, serieLength ):    
			#logger.debug(  ' t :  %s ' % t )                   
			level[t] = alpha*serie[t][1] + (1-alpha)*(level[t-1]+trend[t-1])
			trend[t] = beta*(level[t]-level[t-1]) + (1-beta)*trend[t-1] 

			if t+1 < serieLength :
				  forecastingSerie[ t+1 ] = [ serie[t+1][0], level[t]+trend[t] ]

			if t+1 >= serieLength - duration  :
				tp = serie[t][0] + duration*( serie[-1][0]-serie[-2][0] )
				forecastingSerie[ t+duration ] = [ tp, level[t]+duration*trend[t] ] 

			#logger.debug( 'forecast serie in progress: %s ' % forecastingSerie )		
		logger.debug( '  ' )
		logger.debug( ' Linear forecast serie : %s ' % forecastingSerie )

		return forecastingSerie

###############################################################################
#
###############################################################################
def calculateHoltWintersAdditiveSeasonalMethod( serie, duration, season,
												alpha=0.3, beta=0.3, gamma=0.3 ):
	
	logger.debug('calculateHoltWintersAdditiveSeasonalMethod')

	serieLength  =  len( serie )

	if serieLength < duration :
		logger.debug(  ' We have an insufficient value number to calculate forecasting ' )
		return {}

	else:
		# Serie of coefficients ( trend ) 
		forecastingDuration = serieLength + duration
		level = [0]*serieLength
		trend = [0]*serieLength
		seasonality =[0]*serieLength

		# forecast value list
		forecastingSerie = [0]*forecastingDuration


		# Initialization
		level[0] = sum( [ i[1] for i in serie[0:season] ]) / float(season)
		trend[0] = ( sum( [i[1] for i in serie[season:2 *season] ] ) - sum( [ i[1] for i in serie[:season] ] ))/float( season**2 )
		seasonality[0] = serie[0][1]/level[0]
		forecastingSerie[0] = [ serie[0][0], level[0] ]
		forecastingSerie[1] = [ serie[1][0], level[0] + trend[0] + seasonality[0] ]

		#logger.debug(  'level0 : %s' % level[0] )
		#logger.debug(  'trend0 : %s' % trend[0] )
		#logger.debug(  'seasonality0 : %s' % seasonality[0] ) 

		for t in xrange( 1, serieLength ):   
			level[t] = alpha*(serie[t][1]-seasonality[t-1]) + (1-alpha)*( level[t-1]+trend[t-1])

			trend[t] = (1-beta)*trend[t-1] +beta*(level[t]-level[t-1])

			seasonality[t] = gamma*(serie[t][1]-level[t]) + (1-gamma)*seasonality[t-1]

			if( t+1 < serieLength):
				forecastingSerie[t+1] = [ serie[t+1][0], level[t] +trend[t] + seasonality[t] ]

			if t+1 >= serieLength - duration  :					
				tp = serie[t][0] + (duration)*( serie[-1][0]-serie[-2][0] )

				forecastingSerie[t+duration] = [tp, level[t] + duration*trend[t] + seasonality[t] ]

				#logger.debug(  "Value for t+duration : %s" % forecastingSerie[t+duration] )

		#logger.debug( ' Additive forecast serie : %s ' % forecastingSerie )

		return forecastingSerie

###############################################################################
#
###############################################################################
def calculateHoltWintersMultiplicativeSeasonalMethod(  serie, duration,
												   season, alpha=0.3, 
												   beta=0.3, gamma=0.3 ):

	logger.debug('calculateHoltWintersMultiplicativeSeasonalMethod')

	serieLength  =  len( serie )

	if serieLength < duration :
		logger.debug(  ' We  have a insufficient number of serie to calculate forecasting ' )
		return {}

	else:
		# Serie of coefficients ( trend ) 
		forecastingDuration = serieLength + duration
		level = [0]*serieLength
		trend = [0]*serieLength
		seasonality = [0]*serieLength

		# forecast value list
		forecastingSerie = [0]*forecastingDuration


		# Initialization
		level[0] = sum( [ i[1] for i in serie[0:season] ]) / float(season)
		trend[0] = ( sum( [i[1] for i in serie[season:2 *season] ] ) - sum( [ i[1] for i in serie[:season] ] ))/float( season**2 )
		seasonality[0] = serie[0][1]/level[0]
		forecastingSerie[0] = [ serie[0][0], level[0] ]
		forecastingSerie[1] = [ serie[1][0], level[0] + trend[0] + seasonality[0] ]
		#logger.debug(  'level0 : %s' % level[0] )
		#logger.debug(  'trend0 : %s' % trend[0] )
		#logger.debug(  'seasonality0 : %s' % seasonality[0] ) 
				
		for t in xrange( 1, serieLength ):   
			level[t] = alpha*(serie[t][1]/seasonality[t-1]) + (1-alpha)*( level[t-1]+trend[t-1])
			trend[t] = (1-beta)*trend[t-1] +beta*(level[t]-level[t-1])
			seasonality[t] = gamma*(serie[t][1]/level[t]) + (1-gamma)*seasonality[t-1]

			if( t+1 < serieLength):
				forecastingSerie[t+1] = [ serie[t][0], (level[t] +trend[t])*seasonality[t] ]

			if t+1 >= serieLength - duration  :				
				tp = serie[t][0] + (duration)*( serie[-1][0]-serie[-2][0] )
				forecastingSerie[t+duration] = [tp, (level[t] + duration*trend[t])*seasonality[t] ]
				#logger.debug(  "Value for t+duration : %s" % forecastingSerie[t+duration] )

		#logger.debug( ' Multiplicative forecast serie : %s ' % forecastingSerie )

		return forecastingSerie
