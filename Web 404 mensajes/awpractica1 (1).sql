-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-03-2021 a las 22:47:02
-- Versión del servidor: 10.4.14-MariaDB
-- Versión de PHP: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `awpractica1`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `answer`
--

CREATE TABLE `answer` (
  `id_respuesta` int(11) NOT NULL,
  `answer_texto` text NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `v_positivo` int(11) NOT NULL,
  `v_negativo` int(11) NOT NULL,
  `answer_correo_user` varchar(100) NOT NULL,
  `answer_id_pregunta` int(100) NOT NULL,
  `answer_puntos` decimal(65,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `answer`
--

INSERT INTO `answer` (`id_respuesta`, `answer_texto`, `fecha`, `v_positivo`, `v_negativo`, `answer_correo_user`, `answer_id_pregunta`, `answer_puntos`) VALUES
(1, 'La propiedad position sirve para posicionar un elemento dentro de la página. Sin embargo, dependiendo de cual sea la propiedad que usemos, el elemento tomará una referencia u otra para posicionarse respecto a ella.\r\n\r\nLos posibles valores que puede adoptar la propiedad position son: static | relative | absolute | fixed | inherit | initial.\r\n', '2021-01-14', 0, 0, 'lucas@404.es', 3, '0.00'),
(2, 'La pseudoclase :nth-child() selecciona los hermanos que cumplan cierta condición definida en la fórmula an + b. a y b deben ser números enteros, n es un contador. El grupo an representa un ciclo, cada cuantos elementos se repite; b indica desde donde empezamos a contar.', '2021-01-14', 0, 0, 'emy@404.es', 4, '0.00'),
(5, 'holi', '2021-01-27', 0, 0, 'sfg@404.es', 7, '0.00');

--
-- Disparadores `answer`
--
;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `join_user_answer_votes`
--

CREATE TABLE `join_user_answer_votes` (
  `join_user_answer_votes_correo_user` varchar(255) NOT NULL,
  `join_user_answer_votes_id_respuesta` int(100) NOT NULL,
  `join_user_answer_votes_id` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `join_user_question`
--

CREATE TABLE `join_user_question` (
  `join_user_question_correo_user` varchar(100) DEFAULT NULL,
  `join_user_question_id_pregunta` int(10) DEFAULT NULL,
  `join_user_question_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `join_user_question`
--

INSERT INTO `join_user_question` (`join_user_question_correo_user`, `join_user_question_id_pregunta`, `join_user_question_id`) VALUES
('sfg@404.es', 5, 17),
('sfg@404.es', 7, 18);

--
-- Disparadores `join_user_question`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `join_user_question_votes`
--

CREATE TABLE `join_user_question_votes` (
  `join_user_question_votes_correo_user` varchar(255) NOT NULL,
  `join_user_question_votes_id_pregunta` int(100) NOT NULL,
  `id_voto_question` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medallas_user_answer`
--

CREATE TABLE `medallas_user_answer` (
  `medallas_answer_correo_user` varchar(255) NOT NULL,
  `medallas_answer_id_respuesta` int(100) NOT NULL,
  `id_medallas_user_answer` int(100) NOT NULL,
  `medallas_nombre` varchar(255) NOT NULL,
  `medallas_answer_fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `medallas_metal` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medallas_user_question`
--

CREATE TABLE `medallas_user_question` (
  `medallas_question_correo_user` varchar(255) NOT NULL,
  `medallas_question_id_pregunta` int(100) NOT NULL,
  `id_medallas_user_question` int(100) NOT NULL,
  `medallas_question_fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `medallas_metal` varchar(255) NOT NULL,
  `medallas_nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medallas_user_visit`
--

CREATE TABLE `medallas_user_visit` (
  `medallas_visit_correo_user` varchar(255) NOT NULL,
  `medallas_visit_id_pregunta` int(100) NOT NULL,
  `medallas_nombre` varchar(255) NOT NULL,
  `medallas_metal` varchar(255) NOT NULL,
  `medallas_visit_fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `id_medallas_user_visit` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `email_user` varchar(255) NOT NULL,
  `email_send` varchar(255) NOT NULL,
  `texto` varchar(255) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `messages`
--

INSERT INTO `messages` (`id`, `email_user`, `email_send`, `texto`, `fecha`) VALUES
(14, 'emy@404.es', 'sfg@404.es', 'a ver que tal', '2021-01-27 14:54:55');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `question`
--

CREATE TABLE `question` (
  `id_pregunta` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `texto` text NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `correo_user` varchar(100) NOT NULL,
  `visitas` int(11) NOT NULL,
  `voto_positivo` int(11) NOT NULL,
  `voto_negativo` int(11) NOT NULL,
  `question_puntos` decimal(65,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `question`
--

INSERT INTO `question` (`id_pregunta`, `titulo`, `texto`, `fecha`, `correo_user`, `visitas`, `voto_positivo`, `voto_negativo`, `question_puntos`) VALUES
(3, '¿Cual es la diferencia entre position: relative, position: absolute y position: fixed?', 'Sé que estas propiedades de CSS sirven para posicionar un elemento dentro de la página. Sé que estas propiedades de CSS sirven para posicionar un elemento dentro de la página.', '2021-01-14 16:34:09', 'nico@404.es', 0, 0, 0, '0.00'),
(4, '¿Cómo funciona exactamente nth-child?', 'No acabo de comprender muy bien que hace exactamente y qué usos prácticos puede tener.', '2021-01-14 16:34:09', 'roberto@404.es', 0, 0, 0, '0.00'),
(5, 'Diferencias entre == y === (comparaciones en JavaScript)', 'Siempre he visto que en JavaScript hay:\r\n\r\nasignaciones =\r\ncomparaciones == y ===\r\nCreo entender que == hace algo parecido a comparar el valor de la variable y el === también compara el tipo (como un equals de java).\r\n', '2021-01-14 16:36:38', 'sfg@404.es', 1, 0, 0, '0.00'),
(6, 'Problema con asincronismo en Node\r\n', 'Soy nueva en Node... Tengo una modulo que conecta a una BD de postgres por medio de pg-node. En eso no tengo problemas. Mi problema es que al llamar a ese modulo, desde otro modulo, y despues querer usar los datos que salieron de la BD me dice undefined... Estoy casi seguro que es porque la conexion a la BD devuelve una promesa, y los datos no estan disponibles al momento de usarlos.', '2021-01-14 16:36:38', 'marta@404.es', 0, 0, 0, '0.00'),
(7, '¿Qué es la inyección SQL y cómo puedo evitarla?', 'He encontrado bastantes preguntas en StackOverflow sobre programas o formularios web que guardan información en una base de datos (especialmente en PHP y MySQL) y que contienen graves problemas de seguridad relacionados principalmente con la inyección SQL.\r\n\r\nNormalmente dejo un comentario y/o un enlace a una referencia externa, pero un comentario no da mucho espacio para mucho y sería positivo que hubiera una referencia interna en SOes sobre el tema así que decidí escribir esta pregunta.\r\n', '2021-01-14 16:36:38', 'lucas@404.es', 1, 0, 0, '0.00');

--
-- Disparadores `question`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tags`
--

CREATE TABLE `tags` (
  `nombre` varchar(255) NOT NULL,
  `id_p` int(11) NOT NULL,
  `id_tag` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tags`
--

INSERT INTO `tags` (`nombre`, `id_p`, `id_tag`) VALUES
('@css', 3, 1),
('@css3', 3, 2),
('@css', 4, 3),
('@html', 4, 4),
('@JavaScript', 5, 5),
('@nodejs', 6, 6),
('@mysql', 7, 7),
('@sql', 7, 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `img` varchar(100) NOT NULL,
  `reputacion` int(11) NOT NULL DEFAULT 1,
  `fecha_alta` date NOT NULL DEFAULT current_timestamp(),
  `preguntas` int(11) NOT NULL,
  `respuestas` int(11) NOT NULL,
  `nombre_user` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`email`, `password`, `img`, `reputacion`, `fecha_alta`, `preguntas`, `respuestas`, `nombre_user`) VALUES
('emy@404.es', '123456', '271e71c69dd4f2e4bb94f430c315ee74', 1, '2021-01-14', 0, 1, 'Emy'),
('lucas@404.es', '123456', '4.png', 1, '2021-01-14', 1, 1, 'Lucas'),
('marta@404.es', '123456', 'b059300d6142c19b4c051174c68cfd8e', 1, '2021-01-14', 1, 0, 'Marta'),
('nico@404.es', '123456', 'ab5c8290a9507287f34df5f111d76b82', 1, '2021-01-14', 1, 0, 'Nico'),
('roberto@404.es', '123456', 'dc98ccc358b65df255fa6f31fb089a54', 1, '2021-01-14', 1, 0, 'Roberto'),
('sfg@404.es', '123456', 'fd98cfb70c077a41dd0531f51b777abd', 1, '2021-01-14', 1, 1, 'SFG');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `answer`
--
ALTER TABLE `answer`
  ADD PRIMARY KEY (`id_respuesta`),
  ADD KEY `answer_correo_user` (`answer_correo_user`),
  ADD KEY `answer_id_pregunta` (`answer_id_pregunta`);

--
-- Indices de la tabla `join_user_answer_votes`
--
ALTER TABLE `join_user_answer_votes`
  ADD PRIMARY KEY (`join_user_answer_votes_id`),
  ADD KEY `join_user_answer_votes_correo_user` (`join_user_answer_votes_correo_user`),
  ADD KEY `join_user_answer_votes_ibfk_2` (`join_user_answer_votes_id_respuesta`);

--
-- Indices de la tabla `join_user_question`
--
ALTER TABLE `join_user_question`
  ADD PRIMARY KEY (`join_user_question_id`),
  ADD KEY `join_user_question_correo_user` (`join_user_question_correo_user`),
  ADD KEY `join_user_question_id_pregunta` (`join_user_question_id_pregunta`);

--
-- Indices de la tabla `join_user_question_votes`
--
ALTER TABLE `join_user_question_votes`
  ADD PRIMARY KEY (`id_voto_question`),
  ADD KEY `join_user_question_votes_correo_user` (`join_user_question_votes_correo_user`),
  ADD KEY `join_user_question_votes_id_pregunta` (`join_user_question_votes_id_pregunta`);

--
-- Indices de la tabla `medallas_user_answer`
--
ALTER TABLE `medallas_user_answer`
  ADD PRIMARY KEY (`id_medallas_user_answer`),
  ADD KEY `medallas_answer_correo_user` (`medallas_answer_correo_user`),
  ADD KEY `medallas_answer_id_respuesta` (`medallas_answer_id_respuesta`);

--
-- Indices de la tabla `medallas_user_question`
--
ALTER TABLE `medallas_user_question`
  ADD PRIMARY KEY (`id_medallas_user_question`),
  ADD KEY `medallas_question_correo_user` (`medallas_question_correo_user`),
  ADD KEY `medallas_question_id_pregunta` (`medallas_question_id_pregunta`);

--
-- Indices de la tabla `medallas_user_visit`
--
ALTER TABLE `medallas_user_visit`
  ADD PRIMARY KEY (`id_medallas_user_visit`),
  ADD KEY `medallas_visit_correo_user` (`medallas_visit_correo_user`),
  ADD KEY `medallas_visit_id_pregunta` (`medallas_visit_id_pregunta`);

--
-- Indices de la tabla `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email_user` (`email_user`),
  ADD KEY `email_send` (`email_send`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id_pregunta`),
  ADD KEY `correo_user` (`correo_user`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id_tag`),
  ADD KEY `id_p` (`id_p`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `answer`
--
ALTER TABLE `answer`
  MODIFY `id_respuesta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `join_user_answer_votes`
--
ALTER TABLE `join_user_answer_votes`
  MODIFY `join_user_answer_votes_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `join_user_question`
--
ALTER TABLE `join_user_question`
  MODIFY `join_user_question_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `join_user_question_votes`
--
ALTER TABLE `join_user_question_votes`
  MODIFY `id_voto_question` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `medallas_user_answer`
--
ALTER TABLE `medallas_user_answer`
  MODIFY `id_medallas_user_answer` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `medallas_user_question`
--
ALTER TABLE `medallas_user_question`
  MODIFY `id_medallas_user_question` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `medallas_user_visit`
--
ALTER TABLE `medallas_user_visit`
  MODIFY `id_medallas_user_visit` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id_pregunta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `tags`
--
ALTER TABLE `tags`
  MODIFY `id_tag` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `answer`
--
ALTER TABLE `answer`
  ADD CONSTRAINT `answer_ibfk_1` FOREIGN KEY (`answer_correo_user`) REFERENCES `user` (`email`),
  ADD CONSTRAINT `answer_ibfk_2` FOREIGN KEY (`answer_id_pregunta`) REFERENCES `question` (`id_pregunta`);

--
-- Filtros para la tabla `join_user_answer_votes`
--
ALTER TABLE `join_user_answer_votes`
  ADD CONSTRAINT `join_user_answer_votes_ibfk_1` FOREIGN KEY (`join_user_answer_votes_correo_user`) REFERENCES `user` (`email`),
  ADD CONSTRAINT `join_user_answer_votes_ibfk_2` FOREIGN KEY (`join_user_answer_votes_id_respuesta`) REFERENCES `answer` (`id_respuesta`);

--
-- Filtros para la tabla `join_user_question`
--
ALTER TABLE `join_user_question`
  ADD CONSTRAINT `join_user_question_ibfk_1` FOREIGN KEY (`join_user_question_correo_user`) REFERENCES `user` (`email`),
  ADD CONSTRAINT `join_user_question_ibfk_2` FOREIGN KEY (`join_user_question_id_pregunta`) REFERENCES `question` (`id_pregunta`);

--
-- Filtros para la tabla `join_user_question_votes`
--
ALTER TABLE `join_user_question_votes`
  ADD CONSTRAINT `join_user_question_votes_ibfk_1` FOREIGN KEY (`join_user_question_votes_correo_user`) REFERENCES `user` (`email`),
  ADD CONSTRAINT `join_user_question_votes_ibfk_2` FOREIGN KEY (`join_user_question_votes_id_pregunta`) REFERENCES `question` (`id_pregunta`);

--
-- Filtros para la tabla `medallas_user_answer`
--
ALTER TABLE `medallas_user_answer`
  ADD CONSTRAINT `medallas_user_answer_ibfk_1` FOREIGN KEY (`medallas_answer_correo_user`) REFERENCES `user` (`email`),
  ADD CONSTRAINT `medallas_user_answer_ibfk_2` FOREIGN KEY (`medallas_answer_id_respuesta`) REFERENCES `answer` (`id_respuesta`);

--
-- Filtros para la tabla `medallas_user_question`
--
ALTER TABLE `medallas_user_question`
  ADD CONSTRAINT `medallas_user_question_ibfk_1` FOREIGN KEY (`medallas_question_correo_user`) REFERENCES `user` (`email`),
  ADD CONSTRAINT `medallas_user_question_ibfk_2` FOREIGN KEY (`medallas_question_id_pregunta`) REFERENCES `question` (`id_pregunta`);

--
-- Filtros para la tabla `medallas_user_visit`
--
ALTER TABLE `medallas_user_visit`
  ADD CONSTRAINT `medallas_user_visit_ibfk_1` FOREIGN KEY (`medallas_visit_correo_user`) REFERENCES `user` (`email`),
  ADD CONSTRAINT `medallas_user_visit_ibfk_2` FOREIGN KEY (`medallas_visit_id_pregunta`) REFERENCES `question` (`id_pregunta`);

--
-- Filtros para la tabla `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`email_user`) REFERENCES `user` (`email`),
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`email_send`) REFERENCES `user` (`email`);

--
-- Filtros para la tabla `question`
--
ALTER TABLE `question`
  ADD CONSTRAINT `question_ibfk_1` FOREIGN KEY (`correo_user`) REFERENCES `user` (`email`);

--
-- Filtros para la tabla `tags`
--
ALTER TABLE `tags`
  ADD CONSTRAINT `tags_ibfk_1` FOREIGN KEY (`id_p`) REFERENCES `question` (`id_pregunta`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
